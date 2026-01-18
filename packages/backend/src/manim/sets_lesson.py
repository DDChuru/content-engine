"""
Cambridge IGCSE Mathematics - Introduction to Sets
Complete Manim Lesson with Collision Avoidance

Renders to individual scene videos for integration with studio workflow.
"""

from manim import *
import numpy as np

# ============================================================================
# HELPER CLASSES FOR COLLISION AVOIDANCE AND LAYOUT
# ============================================================================

class SmartPositioner:
    """Manages element positioning to avoid overlaps"""

    def __init__(self):
        self.occupied_regions = []

    def find_free_position(self, center, radius=0.3, candidates=None):
        """Find a position near center that doesn't overlap with existing elements"""
        if candidates is None:
            # Generate candidate positions in a grid around center
            candidates = [
                center + np.array([dx, dy, 0])
                for dx in [-0.5, 0, 0.5]
                for dy in [-0.5, 0, 0.5]
            ]

        for pos in candidates:
            if not self._overlaps(pos, radius):
                self.occupied_regions.append((pos, radius))
                return pos

        # If all candidates overlap, return center anyway
        self.occupied_regions.append((center, radius))
        return center

    def _overlaps(self, pos, radius):
        """Check if position overlaps with any occupied region"""
        for occupied_pos, occupied_radius in self.occupied_regions:
            distance = np.linalg.norm(pos - occupied_pos)
            if distance < (radius + occupied_radius):
                return True
        return False

    def clear(self):
        """Clear all occupied regions"""
        self.occupied_regions = []


class SmartVennDiagram(VGroup):
    """Venn Diagram with smart element positioning"""

    def __init__(
        self,
        set_a_elements,
        set_b_elements,
        set_a_label="A",
        set_b_label="B",
        set_a_color=RED_C,
        set_b_color=GREEN_C,
        **kwargs
    ):
        super().__init__(**kwargs)

        self.set_a_elements = set(set_a_elements)
        self.set_b_elements = set(set_b_elements)
        self.intersection = self.set_a_elements & self.set_b_elements
        self.a_only = self.set_a_elements - self.set_b_elements
        self.b_only = self.set_b_elements - self.set_a_elements

        # Create circles
        self.circle_a = Circle(radius=1.5, color=set_a_color, fill_opacity=0.2)
        self.circle_a.shift(LEFT * 0.8)

        self.circle_b = Circle(radius=1.5, color=set_b_color, fill_opacity=0.2)
        self.circle_b.shift(RIGHT * 0.8)

        # Labels outside circles (top)
        self.label_a = Text(set_a_label, color=set_a_color).scale(0.8)
        self.label_a.next_to(self.circle_a, UP, buff=0.3)

        self.label_b = Text(set_b_label, color=set_b_color).scale(0.8)
        self.label_b.next_to(self.circle_b, UP, buff=0.3)

        # Position elements with collision avoidance
        self.positioner = SmartPositioner()
        self.element_mobjects = VGroup()

        # A only elements (left side)
        for elem in sorted(self.a_only):
            pos = self.positioner.find_free_position(
                self.circle_a.get_center() + LEFT * 0.6
            )
            mob = Text(str(elem), color=WHITE).scale(0.7).move_to(pos)
            self.element_mobjects.add(mob)

        # Intersection elements (center)
        for elem in sorted(self.intersection):
            pos = self.positioner.find_free_position(ORIGIN)
            mob = Text(str(elem), color=WHITE).scale(0.7).move_to(pos)
            self.element_mobjects.add(mob)

        # B only elements (right side)
        for elem in sorted(self.b_only):
            pos = self.positioner.find_free_position(
                self.circle_b.get_center() + RIGHT * 0.6
            )
            mob = Text(str(elem), color=WHITE).scale(0.7).move_to(pos)
            self.element_mobjects.add(mob)

        self.add(self.circle_a, self.circle_b, self.label_a, self.label_b, self.element_mobjects)

    def get_intersection_elements(self):
        """Get mobjects for intersection elements"""
        return VGroup(*[
            mob for mob in self.element_mobjects
            if int(mob.text) in self.intersection
        ])

    def get_all_elements(self):
        """Get all element mobjects"""
        return self.element_mobjects


# ============================================================================
# LESSON SCENES
# ============================================================================

class IntroTitle(Scene):
    """Scene 1: Title slide"""

    def construct(self):
        title = Text("Introduction to Sets", font_size=60, color=BLUE_C)
        subtitle = Text("Cambridge IGCSE Mathematics", font_size=32, color=GRAY)
        subtitle.next_to(title, DOWN, buff=0.5)

        self.play(
            Write(title),
            run_time=1.5
        )
        self.play(
            FadeIn(subtitle, shift=UP * 0.3),
            run_time=1
        )
        self.wait(2)


class WhatIsASet(Scene):
    """Scene 2: Definition of a set"""

    def construct(self):
        title = Text("What is a Set?", font_size=48, color=BLUE_C)
        title.to_edge(UP)

        definition = VGroup(
            Text("A Set is a collection of distinct", font_size=32),
            Text("objects or elements.", font_size=32),
            Text("We write sets using curly braces: { }", font_size=32, color=YELLOW),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        definition.next_to(title, DOWN, buff=1)

        # Visual example
        example_box = Rectangle(
            width=8, height=2.5,
            color=BLUE_C,
            fill_opacity=0.1
        ).next_to(definition, DOWN, buff=0.8)

        basket = SVGMobject("basket", fill_opacity=0.3).scale(0.5) if False else Circle(radius=0.5, color=BLUE_C)
        basket.move_to(example_box.get_center() + LEFT * 2.5)

        items = VGroup(
            *[Circle(radius=0.2, color=random_bright_color()).shift(RIGHT * i * 0.6)
              for i in range(5)]
        )
        items.move_to(example_box.get_center())

        self.play(Write(title))
        self.wait(0.5)

        for line in definition:
            self.play(Write(line), run_time=0.8)
            self.wait(0.3)

        self.play(Create(example_box))
        self.play(FadeIn(basket, scale=0.5))
        self.play(LaggedStart(*[FadeIn(item, scale=0.5) for item in items], lag_ratio=0.2))

        self.wait(2)


class SetNotation(Scene):
    """Scene 3: Set notation with examples - highlights common elements 2 and 3"""

    def construct(self):
        title = Text("Set Notation", font_size=48, color=BLUE_C)
        title.to_edge(UP)

        # Build Set A with separate parts so we can highlight specific numbers
        # Set A = {1, 2, 3}
        set_a_prefix = MathTex(r"\text{Set } A = \{", font_size=44, color=RED_C)
        set_a_1 = MathTex(r"1", font_size=44, color=RED_C)
        set_a_comma1 = MathTex(r",", font_size=44, color=RED_C)
        set_a_2 = MathTex(r"2", font_size=44, color=RED_C)  # Common element
        set_a_comma2 = MathTex(r",", font_size=44, color=RED_C)
        set_a_3 = MathTex(r"3", font_size=44, color=RED_C)  # Common element
        set_a_suffix = MathTex(r"\}", font_size=44, color=RED_C)

        set_a = VGroup(
            set_a_prefix, set_a_1, set_a_comma1, set_a_2, set_a_comma2, set_a_3, set_a_suffix
        ).arrange(RIGHT, buff=0.08)

        # Build Set B with separate parts so we can highlight specific numbers
        # Set B = {2, 3, 4}
        set_b_prefix = MathTex(r"\text{Set } B = \{", font_size=44, color=GREEN_C)
        set_b_2 = MathTex(r"2", font_size=44, color=GREEN_C)  # Common element
        set_b_comma1 = MathTex(r",", font_size=44, color=GREEN_C)
        set_b_3 = MathTex(r"3", font_size=44, color=GREEN_C)  # Common element
        set_b_comma2 = MathTex(r",", font_size=44, color=GREEN_C)
        set_b_4 = MathTex(r"4", font_size=44, color=GREEN_C)
        set_b_suffix = MathTex(r"\}", font_size=44, color=GREEN_C)

        set_b = VGroup(
            set_b_prefix, set_b_2, set_b_comma1, set_b_3, set_b_comma2, set_b_4, set_b_suffix
        ).arrange(RIGHT, buff=0.08)

        sets = VGroup(set_a, set_b).arrange(DOWN, buff=0.8)
        sets.next_to(title, DOWN, buff=1.5)

        observation = Text(
            "Notice: Elements 2 and 3 appear in BOTH sets",
            font_size=28,
            color=YELLOW
        )
        observation.next_to(sets, DOWN, buff=1)

        self.play(Write(title))
        self.wait(0.5)

        self.play(Write(set_a))
        self.wait(0.5)
        self.play(Write(set_b))
        self.wait(1)

        # Highlight common elements (2 and 3 in both sets)
        box_2_a = SurroundingRectangle(set_a_2, color=YELLOW, buff=0.1)
        box_3_a = SurroundingRectangle(set_a_3, color=YELLOW, buff=0.1)
        box_2_b = SurroundingRectangle(set_b_2, color=YELLOW, buff=0.1)
        box_3_b = SurroundingRectangle(set_b_3, color=YELLOW, buff=0.1)

        self.play(
            Create(box_2_a), Create(box_3_a),
            Create(box_2_b), Create(box_3_b)
        )
        self.play(Write(observation))

        self.wait(2)


class VennIntro(Scene):
    """Scene 4: Introduction to Venn Diagrams"""

    def construct(self):
        title = Text("Venn Diagrams", font_size=54, color=BLUE_C)
        subtitle = Text(
            "Visual way to show sets and their relationships",
            font_size=32,
            color=GRAY
        )
        subtitle.next_to(title, DOWN, buff=0.3)

        title_group = VGroup(title, subtitle)
        title_group.move_to(ORIGIN)

        self.play(Write(title))
        self.play(FadeIn(subtitle, shift=UP * 0.2))

        self.wait(2)


class SetAVisualized(Scene):
    """Scene 5: Visualizing Set A with narrative flow - notation FIRST, then elements fly into circle

    CORRECT ANIMATION SEQUENCE:
    1. Title appears
    2. Set notation A = {1, 2, 3} appears CENTERED (pause to read)
    3. Notation moves UP to final position
    4. Circle is drawn below
    5. ONLY THEN: Yellow numbers appear FROM notation and fly INTO the circle
    """

    def construct(self):
        title = Text("Set A", font_size=44, color=RED_C)
        title.to_edge(UP)

        # STEP 1: Show title
        self.play(Write(title))
        self.wait(0.3)

        # STEP 2: Show notation CENTERED first (let students read it)
        set_notation = MathTex(r"A = \{1, 2, 3\}", font_size=48, color=RED_C)
        set_notation.move_to(ORIGIN)

        self.play(Write(set_notation))
        self.wait(1.5)  # Let students read the notation

        # STEP 3: Notation moves UP to make room for circle
        notation_final_pos = UP * 2
        self.play(
            set_notation.animate.move_to(notation_final_pos),
            run_time=1
        )
        self.wait(0.5)

        # STEP 4: Circle is drawn AFTER notation is in position
        circle = Circle(radius=1.8, color=RED_C, fill_opacity=0.2)
        circle.shift(DOWN * 0.8)

        label = Text("A", color=RED_C).scale(0.8)
        label.next_to(circle, UP + LEFT, buff=0.2)

        self.play(
            Create(circle),
            Write(label),
            run_time=1.5
        )
        self.wait(0.5)

        # STEP 5: ONLY NOW - Yellow numbers FLY from notation INTO the circle
        # Calculate target positions in circle (spread evenly)
        target_positions = []
        for i in range(3):
            angle = PI/2 + i * 2 * PI / 3  # Start from top, go clockwise
            pos = circle.get_center() + np.array([
                np.cos(angle) * 0.9,
                np.sin(angle) * 0.9,
                0
            ])
            target_positions.append(pos)

        # Create elements and animate them one by one with proper staging
        numbers = [1, 2, 3]
        for i, num in enumerate(numbers):
            # Create yellow number at notation position (where it "emerges" from)
            flying_num = Text(str(num), font_size=44, color=YELLOW)
            flying_num.move_to(set_notation.get_center())

            # Target position in circle
            target_num = Text(str(num), font_size=44, color=WHITE)
            target_num.move_to(target_positions[i])

            # Animate: FadeIn at notation, then Transform/Move to circle
            self.play(
                FadeIn(flying_num, scale=1.5),
                run_time=0.3
            )
            self.play(
                Transform(flying_num, target_num),
                run_time=0.6
            )
            self.wait(0.2)

        self.wait(2)


class TwoSetsOverlap(Scene):
    """Scene 6: Two sets with overlap - NARRATIVE FLOW VERSION"""

    def construct(self):
        title = Text("Two Sets Overlap", font_size=48, color=BLUE_C)
        title.to_edge(UP)

        self.play(Write(title))
        self.wait(0.3)

        # STEP 1: Show BOTH set notations first (key change!)
        notation_a = MathTex(r"A = \{1, 2, 3\}", font_size=40, color=RED_C)
        notation_b = MathTex(r"B = \{2, 3, 4\}", font_size=40, color=GREEN_C)

        notation_a.shift(UP * 0.5 + LEFT * 2)
        notation_b.shift(UP * 0.5 + RIGHT * 2)

        self.play(Write(notation_a))
        self.wait(0.5)
        self.play(Write(notation_b))
        self.wait(1)  # Let students read both sets

        # STEP 2: Create circles
        circle_a = Circle(radius=1.5, color=RED_C, fill_opacity=0.2)
        circle_a.shift(DOWN * 0.8 + LEFT * 0.8)

        circle_b = Circle(radius=1.5, color=GREEN_C, fill_opacity=0.2)
        circle_b.shift(DOWN * 0.8 + RIGHT * 0.8)

        label_a = Text("A", color=RED_C).scale(0.8)
        label_a.next_to(circle_a, UP, buff=0.3)

        label_b = Text("B", color=GREEN_C).scale(0.8)
        label_b.next_to(circle_b, UP, buff=0.3)

        # Move notations to top and draw circles
        self.play(
            notation_a.animate.scale(0.7).move_to(UP * 2.5 + LEFT * 2),
            notation_b.animate.scale(0.7).move_to(UP * 2.5 + RIGHT * 2),
            Create(circle_a),
            Create(circle_b),
            Write(label_a),
            Write(label_b),
            run_time=2
        )
        self.wait(0.5)

        # STEP 3: Elements fly from notation into circles (THE MAGIC!)
        # Create source elements at notation positions
        set_a = [1, 2, 3]
        set_b = [2, 3, 4]
        intersection = [2, 3]
        a_only = [1]
        b_only = [4]

        # Positions for final elements
        positioner = SmartPositioner()

        animations = []

        # Animate A-only elements (1)
        for num in a_only:
            source = Text(str(num), font_size=32, color=YELLOW)
            source.move_to(notation_a.get_center())

            target = Text(str(num), font_size=40, color=WHITE)
            target.move_to(circle_a.get_center() + LEFT * 0.6)

            self.add(source)
            animations.append(Transform(source, target))

        # Animate intersection elements (2, 3) - these are special!
        for i, num in enumerate(intersection):
            source = Text(str(num), font_size=32, color=YELLOW)
            source.move_to(notation_a.get_center())

            target = Text(str(num), font_size=40, color=WHITE)
            # Position in overlap region
            target.move_to(ORIGIN + DOWN * 0.8 + UP * (i - 0.5) * 0.5)

            self.add(source)
            animations.append(Transform(source, target))

        # Animate B-only elements (4)
        for num in b_only:
            source = Text(str(num), font_size=32, color=YELLOW)
            source.move_to(notation_b.get_center())

            target = Text(str(num), font_size=40, color=WHITE)
            target.move_to(circle_b.get_center() + RIGHT * 0.6)

            self.add(source)
            animations.append(Transform(source, target))

        # All elements fly to their positions!
        self.play(
            LaggedStart(*animations, lag_ratio=0.3),
            run_time=2.5
        )

        self.wait(1)

        # STEP 4: Highlight intersection and explain it! (key addition)
        # Yellow circle to highlight BOTH intersection elements (2 and 3)
        intersection_highlight = Circle(
            radius=1.0,  # Bigger to cover both 2 and 3
            color=YELLOW,
            stroke_width=6
        ).move_to(ORIGIN + DOWN * 0.5)  # Centered on intersection

        # Highlight the overlap region
        self.play(
            Create(intersection_highlight),
            run_time=1
        )
        self.wait(0.5)

        # STEP 5: Show intersection notation at the BOTTOM
        intersection_notation = MathTex(
            r"A \cap B = \{2, 3\}",
            font_size=38,
            color=YELLOW
        )
        intersection_notation.to_edge(DOWN, buff=0.6)

        self.play(Write(intersection_notation))
        self.wait(0.5)

        # STEP 6: Show explanation text on the RIGHT side
        explanation_title = Text(
            "INTERSECTION",
            font_size=24,
            color=YELLOW,
            weight=BOLD
        )
        explanation_line1 = Text(
            "The overlapping region",
            font_size=20,
            color=WHITE
        )
        explanation_line2 = Text(
            "contains elements in",
            font_size=20,
            color=WHITE
        )
        explanation_line3 = Text(
            "BOTH sets.",
            font_size=20,
            color=YELLOW
        )

        explanation_group = VGroup(
            explanation_title,
            explanation_line1,
            explanation_line2,
            explanation_line3
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.15)

        # Position on the right side of the screen
        explanation_group.to_edge(RIGHT, buff=0.4)
        explanation_group.shift(DOWN * 0.5)

        # Animate explanation appearing
        self.play(
            FadeIn(explanation_title, shift=LEFT * 0.3),
            run_time=0.5
        )
        self.play(
            FadeIn(explanation_line1, shift=LEFT * 0.2),
            FadeIn(explanation_line2, shift=LEFT * 0.2),
            FadeIn(explanation_line3, shift=LEFT * 0.2),
            run_time=0.8
        )

        self.wait(3)  # Give time to read


class IntersectionHighlight(Scene):
    """Scene 7: Intersection highlighted"""

    def construct(self):
        title = MathTex(r"\text{Intersection } (A \cap B)", font_size=44, color=YELLOW)
        title.to_edge(UP)

        # Create Venn diagram
        venn = SmartVennDiagram(
            set_a_elements=[1, 2, 3],
            set_b_elements=[2, 3, 4]
        )
        venn.scale(0.8).shift(DOWN * 0.8)

        self.add(venn)
        self.play(Write(title))

        # Get intersection elements
        intersection_elems = venn.get_intersection_elements()

        # Highlight intersection elements
        self.play(
            *[elem.animate.set_color(YELLOW).scale(1.3) for elem in intersection_elems],
            run_time=1
        )

        # Add formula
        formula = MathTex(r"A \cap B = \{2, 3\}", font_size=36, color=YELLOW)
        subtext = Text("(Elements in BOTH sets)", font_size=24, color=GRAY)

        formula_group = VGroup(formula, subtext).arrange(DOWN, buff=0.2)
        formula_group.to_edge(DOWN, buff=1)

        self.play(Write(formula))
        self.play(FadeIn(subtext, shift=UP * 0.2))

        self.wait(2)


class UnionConcept(Scene):
    """Scene 8: Union concept - animated with set notations and explanation

    Animation sequence:
    1. Title appears
    2. Set A notation appears on left
    3. Set B notation appears on right
    4. Both sets animate to show the union formula
    5. Explanation panel shows that 2 and 3 appear only once
    """

    def construct(self):
        title = MathTex(r"\text{Union } (A \cup B)", font_size=44, color=BLUE_C)
        title.to_edge(UP)

        # STEP 1: Show title
        self.play(Write(title))
        self.wait(0.3)

        # STEP 2: Show Set A notation on the left
        set_a_notation = MathTex(r"A = \{1, 2, 3\}", font_size=40, color=RED_C)
        set_a_notation.shift(LEFT * 3 + UP * 1)

        # STEP 3: Show Set B notation on the right
        set_b_notation = MathTex(r"B = \{2, 3, 4\}", font_size=40, color=GREEN_C)
        set_b_notation.shift(RIGHT * 3 + UP * 1)

        self.play(Write(set_a_notation))
        self.wait(0.3)
        self.play(Write(set_b_notation))
        self.wait(0.5)

        # STEP 4: Draw arrows pointing down to the union result
        arrow_a = Arrow(
            set_a_notation.get_bottom() + DOWN * 0.2,
            DOWN * 0.5 + LEFT * 1,
            color=RED_C,
            stroke_width=3
        )
        arrow_b = Arrow(
            set_b_notation.get_bottom() + DOWN * 0.2,
            DOWN * 0.5 + RIGHT * 1,
            color=GREEN_C,
            stroke_width=3
        )

        self.play(Create(arrow_a), Create(arrow_b))
        self.wait(0.3)

        # STEP 5: Show the union result in the center
        union_result = MathTex(
            r"A \cup B = \{1, 2, 3, 4\}",
            font_size=48,
            color=BLUE_C
        )
        union_result.shift(DOWN * 1)

        self.play(Write(union_result))
        self.wait(0.5)

        # STEP 6: Add explanation panel on the right (with proper spacing)
        explanation_title = Text(
            "UNION",
            font_size=22,
            color=BLUE_C,
            weight=BOLD
        )
        explanation_line1 = Text("Combines ALL elements", font_size=16, color=WHITE)
        explanation_line2 = Text("from both sets.", font_size=16, color=WHITE)
        explanation_line4 = Text("2 and 3 appear in both", font_size=16, color=YELLOW)
        explanation_line5 = Text("but written only ONCE!", font_size=16, color=YELLOW)

        explanation_group = VGroup(
            explanation_title,
            explanation_line1,
            explanation_line2,
            explanation_line4,
            explanation_line5
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.25)
        explanation_group.to_edge(RIGHT, buff=0.3)
        explanation_group.shift(DOWN * 0.5)

        # Add a subtle background box
        explanation_bg = SurroundingRectangle(
            explanation_group,
            color=BLUE_C,
            fill_opacity=0.1,
            buff=0.2,
            corner_radius=0.1
        )

        self.play(
            FadeIn(explanation_bg),
            Write(explanation_title)
        )
        self.play(
            Write(explanation_line1),
            Write(explanation_line2)
        )
        self.wait(0.3)
        self.play(
            Write(explanation_line4),
            Write(explanation_line5)
        )

        self.wait(2)


class UnionVennMorph(Scene):
    """Enhanced Union Scene: Notation morphs into Venn Diagram

    Animation sequence:
    1. Show A∪B notation prominently
    2. Show set definitions A = {1, 2, 3} and B = {2, 3, 4}
    3. Morph curly braces into circles (shape morphing effect)
    4. Elements fly from notation into correct Venn positions
    5. Highlight union region with glow effect
    6. Show final union result
    """

    def construct(self):
        # Color scheme
        COLOR_A = "#ef4444"  # Red
        COLOR_B = "#22c55e"  # Green
        COLOR_UNION = "#3b82f6"  # Blue
        COLOR_OVERLAP = "#a855f7"  # Purple

        # ========== PHASE 1: Show Union Notation ==========
        union_symbol = MathTex(r"A \cup B", font_size=72, color=COLOR_UNION)
        union_symbol.move_to(ORIGIN)

        self.play(Write(union_symbol), run_time=1)
        self.wait(0.5)

        # Move union symbol to top
        self.play(union_symbol.animate.to_edge(UP, buff=0.5).scale(0.7), run_time=0.8)

        # ========== PHASE 2: Show Set Definitions ==========
        set_a_def = MathTex(r"A = \{1, 2, 3\}", font_size=44, color=COLOR_A)
        set_b_def = MathTex(r"B = \{2, 3, 4\}", font_size=44, color=COLOR_B)

        set_a_def.move_to(LEFT * 3 + UP * 1.5)
        set_b_def.move_to(RIGHT * 3 + UP * 1.5)

        self.play(Write(set_a_def), run_time=0.8)
        self.play(Write(set_b_def), run_time=0.8)
        self.wait(0.5)

        # ========== PHASE 3: Create Venn Diagram Circles ==========
        # Create circles that will appear through morphing
        circle_a = Circle(radius=1.5, color=COLOR_A, stroke_width=4)
        circle_a.set_fill(COLOR_A, opacity=0.2)
        circle_a.move_to(LEFT * 1)

        circle_b = Circle(radius=1.5, color=COLOR_B, stroke_width=4)
        circle_b.set_fill(COLOR_B, opacity=0.2)
        circle_b.move_to(RIGHT * 1)

        # Animate circles appearing with a "morph" effect from notation
        # First, create small versions at notation positions
        circle_a_small = circle_a.copy().scale(0.1).move_to(set_a_def.get_center())
        circle_b_small = circle_b.copy().scale(0.1).move_to(set_b_def.get_center())

        self.add(circle_a_small, circle_b_small)

        # Morph/grow into full circles (no separate labels needed - notation shows A and B)
        self.play(
            Transform(circle_a_small, circle_a),
            Transform(circle_b_small, circle_b),
            run_time=1.5
        )
        self.wait(0.3)

        # ========== PHASE 4: Elements Fly to Positions ==========
        # Create number elements
        elements = {
            "1": (LEFT * 2.2, COLOR_A),           # Only in A
            "2": (LEFT * 0 + DOWN * 0.3, COLOR_OVERLAP),  # In both (overlap)
            "3": (LEFT * 0 + UP * 0.3, COLOR_OVERLAP),    # In both (overlap)
            "4": (RIGHT * 2.2, COLOR_B),          # Only in B
        }

        # Create and animate each element
        element_objects = []
        for num, (pos, color) in elements.items():
            elem = MathTex(num, font_size=40, color=color)
            elem.move_to(pos + DOWN * 0.5)  # Offset down for Venn center
            element_objects.append(elem)

        # Animate elements appearing one by one
        for elem in element_objects:
            self.play(FadeIn(elem, scale=1.5), run_time=0.4)

        self.wait(0.5)

        # ========== PHASE 5: Highlight Union Region ==========
        # Create union highlight (both circles shaded)
        union_highlight = VGroup(circle_a_small, circle_b_small).copy()
        union_highlight.set_fill(COLOR_UNION, opacity=0.4)
        union_highlight.set_stroke(COLOR_UNION, width=6)

        # Flash effect on union
        self.play(
            circle_a_small.animate.set_fill(COLOR_UNION, opacity=0.3),
            circle_b_small.animate.set_fill(COLOR_UNION, opacity=0.3),
            Flash(circle_a_small.get_center(), color=COLOR_UNION, line_length=0.3),
            Flash(circle_b_small.get_center(), color=COLOR_UNION, line_length=0.3),
            run_time=0.8
        )

        # ========== PHASE 6: Show Union Result ==========
        result_text = MathTex(
            r"A \cup B = \{1, 2, 3, 4\}",
            font_size=48,
            color=COLOR_UNION
        )
        result_text.to_edge(DOWN, buff=0.8)

        # Add explanation
        explanation = Text(
            "Union: ALL elements from both sets (no duplicates)",
            font_size=20,
            color=WHITE
        )
        explanation.next_to(result_text, DOWN, buff=0.3)

        self.play(Write(result_text), run_time=1)
        self.play(FadeIn(explanation), run_time=0.5)

        self.wait(2)


class IntersectionVennMorph(Scene):
    """Enhanced Intersection Scene: Notation morphs into Venn Diagram

    Animation sequence:
    1. Show A∩B notation prominently
    2. Show set definitions A = {1, 2, 3} and B = {2, 3, 4}
    3. Morph into Venn diagram circles
    4. Elements fly to positions
    5. Highlight ONLY the overlap region (intersection)
    6. Show final intersection result
    """

    def construct(self):
        # Color scheme
        COLOR_A = "#ef4444"  # Red
        COLOR_B = "#22c55e"  # Green
        COLOR_INTERSECT = "#f59e0b"  # Amber/Orange for intersection
        COLOR_OVERLAP = "#a855f7"  # Purple for shared elements

        # ========== PHASE 1: Show Intersection Notation ==========
        intersect_symbol = MathTex(r"A \cap B", font_size=72, color=COLOR_INTERSECT)
        intersect_symbol.move_to(ORIGIN)

        self.play(Write(intersect_symbol), run_time=1)
        self.wait(0.5)

        # Move symbol to top
        self.play(intersect_symbol.animate.to_edge(UP, buff=0.5).scale(0.7), run_time=0.8)

        # ========== PHASE 2: Show Set Definitions ==========
        set_a_def = MathTex(r"A = \{1, 2, 3\}", font_size=44, color=COLOR_A)
        set_b_def = MathTex(r"B = \{2, 3, 4\}", font_size=44, color=COLOR_B)

        set_a_def.move_to(LEFT * 3 + UP * 1.5)
        set_b_def.move_to(RIGHT * 3 + UP * 1.5)

        self.play(Write(set_a_def), run_time=0.8)
        self.play(Write(set_b_def), run_time=0.8)
        self.wait(0.5)

        # ========== PHASE 3: Create Venn Diagram ==========
        circle_a = Circle(radius=1.5, color=COLOR_A, stroke_width=4)
        circle_a.set_fill(COLOR_A, opacity=0.15)
        circle_a.move_to(LEFT * 1 + DOWN * 0.3)

        circle_b = Circle(radius=1.5, color=COLOR_B, stroke_width=4)
        circle_b.set_fill(COLOR_B, opacity=0.15)
        circle_b.move_to(RIGHT * 1 + DOWN * 0.3)

        # Morph effect (no separate labels needed - notation shows A and B)
        circle_a_small = circle_a.copy().scale(0.1).move_to(set_a_def.get_center())
        circle_b_small = circle_b.copy().scale(0.1).move_to(set_b_def.get_center())

        self.add(circle_a_small, circle_b_small)

        self.play(
            Transform(circle_a_small, circle_a),
            Transform(circle_b_small, circle_b),
            run_time=1.5
        )
        self.wait(0.3)

        # ========== PHASE 4: Show Elements ==========
        # Elements with positions
        elem_1 = MathTex("1", font_size=38, color=COLOR_A)
        elem_1.move_to(LEFT * 2.2 + DOWN * 0.3)

        elem_2 = MathTex("2", font_size=38, color=COLOR_OVERLAP)
        elem_2.move_to(DOWN * 0.6)

        elem_3 = MathTex("3", font_size=38, color=COLOR_OVERLAP)
        elem_3.move_to(UP * 0.1)

        elem_4 = MathTex("4", font_size=38, color=COLOR_B)
        elem_4.move_to(RIGHT * 2.2 + DOWN * 0.3)

        for elem in [elem_1, elem_2, elem_3, elem_4]:
            self.play(FadeIn(elem, scale=1.5), run_time=0.35)

        self.wait(0.5)

        # ========== PHASE 5: Highlight Intersection Region ==========
        # Create intersection highlight (lens shape)
        intersection_region = Intersection(
            circle_a_small, circle_b_small,
            color=COLOR_INTERSECT,
            fill_opacity=0.6,
            stroke_width=4
        )

        # Animate the intersection appearing with emphasis
        self.play(
            FadeIn(intersection_region),
            elem_2.animate.set_color(COLOR_INTERSECT).scale(1.3),
            elem_3.animate.set_color(COLOR_INTERSECT).scale(1.3),
            Flash(ORIGIN + DOWN * 0.3, color=COLOR_INTERSECT, line_length=0.4),
            run_time=1
        )

        # Pulse the intersection elements
        self.play(
            elem_2.animate.scale(1/1.3),
            elem_3.animate.scale(1/1.3),
            run_time=0.5
        )

        # ========== PHASE 6: Show Result ==========
        result_text = MathTex(
            r"A \cap B = \{2, 3\}",
            font_size=48,
            color=COLOR_INTERSECT
        )
        result_text.to_edge(DOWN, buff=0.8)

        explanation = Text(
            "Intersection: ONLY elements in BOTH sets",
            font_size=20,
            color=WHITE
        )
        explanation.next_to(result_text, DOWN, buff=0.3)

        self.play(Write(result_text), run_time=1)
        self.play(FadeIn(explanation), run_time=0.5)

        self.wait(2)


class UniversalSetIntro(Scene):
    """Scene 9: Universal Set introduction - Clean visual design

    A visually engaging introduction to the universal set concept
    with animated xi symbol and clear explanations.
    """

    def construct(self):
        # STEP 1: Animated title with large xi symbol
        title = Text("The Universal Set", font_size=44, color=PURPLE_C)
        title.to_edge(UP, buff=0.6)

        self.play(Write(title))
        self.wait(0.3)

        # STEP 2: Large animated xi symbol in center
        xi_big = MathTex(r"\xi", font_size=180, color=PURPLE_C)
        xi_big.move_to(ORIGIN)

        self.play(
            FadeIn(xi_big, scale=0.5),
            run_time=1
        )
        self.wait(0.5)

        # STEP 3: Xi moves to side, explanation appears
        self.play(
            xi_big.animate.scale(0.5).move_to(LEFT * 4 + UP * 0.5),
            run_time=0.8
        )

        # Create clean explanation box on the right
        explanation_box = RoundedRectangle(
            width=7, height=4,
            color=PURPLE_C,
            fill_opacity=0.08,
            corner_radius=0.3
        )
        explanation_box.move_to(RIGHT * 1.5)

        # Main definition
        line1 = Text("Contains ALL possible", font_size=26, color=WHITE)
        line2 = Text("elements in the problem", font_size=26, color=WHITE)

        definition = VGroup(line1, line2).arrange(DOWN, buff=0.15)
        definition.move_to(explanation_box.get_center() + UP * 1)

        self.play(FadeIn(explanation_box))
        self.play(Write(line1))
        self.play(Write(line2))
        self.wait(0.3)

        # STEP 4: Symbol notation info
        symbol_line = VGroup(
            MathTex(r"\xi", font_size=36, color=YELLOW),
            Text(" = Greek letter 'xi'", font_size=22, color=GRAY_B)
        ).arrange(RIGHT, buff=0.2)
        symbol_line.move_to(explanation_box.get_center() + DOWN * 0.3)

        alt_line = VGroup(
            Text("Also written as ", font_size=20, color=GRAY_B),
            MathTex(r"U", font_size=32, color=YELLOW),
        ).arrange(RIGHT, buff=0.1)
        alt_line.move_to(explanation_box.get_center() + DOWN * 1)

        self.play(FadeIn(symbol_line))
        self.wait(0.2)
        self.play(FadeIn(alt_line))

        # STEP 5: Visual metaphor - the "universe" rectangle appears
        universe_rect = Rectangle(
            width=3.5, height=2.5,
            color=PURPLE_C,
            stroke_width=3
        )
        universe_rect.move_to(LEFT * 4 + DOWN * 1.8)

        universe_label = MathTex(r"\xi", font_size=28, color=PURPLE_C)
        universe_label.next_to(universe_rect, UP + LEFT, buff=0.1)

        think_text = Text("Think of it as...", font_size=18, color=GRAY_B)
        think_text.next_to(universe_rect, UP, buff=0.3)

        universe_text = Text("\"The Universe\"", font_size=20, color=PURPLE_B, slant=ITALIC)
        universe_text.move_to(universe_rect.get_center())

        self.play(
            FadeIn(think_text),
            Create(universe_rect),
            Write(universe_label)
        )
        self.play(Write(universe_text))

        self.wait(2)


class UniversalSetExample(Scene):
    """Scene 10: Universal Set with Venn diagram - Beautiful redesign

    A visually stunning demonstration of the universal set containing
    two overlapping sets with clear element placement.
    """

    def construct(self):
        # STEP 1: Title (smaller, at very top)
        title = Text("Universal Set Example", font_size=36, color=PURPLE_C)
        title.to_edge(UP, buff=0.3)

        self.play(Write(title))
        self.wait(0.3)

        # STEP 2: Large, prominent universal set rectangle (THE MAIN FEATURE)
        universal_box = RoundedRectangle(
            width=12, height=6,
            color=PURPLE_C,
            fill_opacity=0.05,
            stroke_width=3,
            corner_radius=0.2
        )
        universal_box.move_to(DOWN * 0.3)

        xi_label = MathTex(r"\xi", font_size=40, color=PURPLE_C)
        xi_label.next_to(universal_box, UP + LEFT, buff=0.1)

        self.play(
            Create(universal_box),
            Write(xi_label),
            run_time=1
        )

        # STEP 3: Given info panel (compact, top right corner inside the box)
        given_title = Text("Given:", font_size=18, color=GRAY_B)
        given_xi = MathTex(r"\xi = \{1..10\}", font_size=20, color=PURPLE_C)
        given_a = MathTex(r"A = \text{evens}", font_size=18, color=RED_C)
        given_b = MathTex(r"B = \text{mult. 3}", font_size=18, color=GREEN_C)

        given_group = VGroup(given_title, given_xi, given_a, given_b).arrange(DOWN, aligned_edge=LEFT, buff=0.12)
        given_group.move_to(universal_box.get_corner(UR) + DL * 0.8)

        self.play(FadeIn(given_group))
        self.wait(0.3)

        # STEP 4: Create beautiful overlapping circles (larger, centered)
        circle_a = Circle(radius=1.6, color=RED_C, fill_opacity=0.25, stroke_width=3)
        circle_a.move_to(LEFT * 1.2 + DOWN * 0.2)

        circle_b = Circle(radius=1.6, color=GREEN_C, fill_opacity=0.25, stroke_width=3)
        circle_b.move_to(RIGHT * 1.2 + DOWN * 0.2)

        label_a = Text("A", font_size=32, color=RED_C, weight=BOLD)
        label_a.next_to(circle_a, UP, buff=0.15)

        label_b = Text("B", font_size=32, color=GREEN_C, weight=BOLD)
        label_b.next_to(circle_b, UP, buff=0.15)

        self.play(
            Create(circle_a),
            Create(circle_b),
            Write(label_a),
            Write(label_b),
            run_time=1.2
        )
        self.wait(0.3)

        # STEP 5: Place elements in correct regions

        # Only in A (evens not divisible by 3): 2, 4, 8, 10
        only_a_nums = VGroup(
            Text("2", font_size=26, color=WHITE),
            Text("4", font_size=26, color=WHITE),
            Text("8", font_size=26, color=WHITE),
            Text("10", font_size=26, color=WHITE),
        )
        only_a_nums[0].move_to(circle_a.get_center() + LEFT * 0.7 + UP * 0.4)
        only_a_nums[1].move_to(circle_a.get_center() + LEFT * 0.7 + DOWN * 0.4)
        only_a_nums[2].move_to(circle_a.get_center() + LEFT * 0.5)
        only_a_nums[3].move_to(circle_a.get_center() + LEFT * 0.3 + DOWN * 0.7)

        # Intersection (6 is both even and multiple of 3)
        intersection_num = Text("6", font_size=30, color=YELLOW, weight=BOLD)
        intersection_num.move_to(ORIGIN + DOWN * 0.2)

        # Only in B (multiples of 3, odd): 3, 9
        only_b_nums = VGroup(
            Text("3", font_size=26, color=WHITE),
            Text("9", font_size=26, color=WHITE),
        )
        only_b_nums[0].move_to(circle_b.get_center() + RIGHT * 0.5 + UP * 0.3)
        only_b_nums[1].move_to(circle_b.get_center() + RIGHT * 0.5 + DOWN * 0.3)

        # Elements OUTSIDE both sets (clearly in the universal set but outside circles)
        outside_nums = VGroup(
            Text("1", font_size=24, color=GRAY_B),
            Text("5", font_size=24, color=GRAY_B),
            Text("7", font_size=24, color=GRAY_B),
        )
        outside_nums[0].move_to(universal_box.get_corner(UL) + DR * 1.2)
        outside_nums[1].move_to(universal_box.get_corner(DL) + UR * 1.2)
        outside_nums[2].move_to(universal_box.get_corner(DR) + UL * 1.2)

        # Animate elements appearing
        self.play(
            LaggedStart(*[FadeIn(n, scale=1.5) for n in only_a_nums], lag_ratio=0.1),
            run_time=0.8
        )
        self.play(
            FadeIn(intersection_num, scale=2),
            run_time=0.5
        )
        self.play(
            LaggedStart(*[FadeIn(n, scale=1.5) for n in only_b_nums], lag_ratio=0.1),
            run_time=0.6
        )
        self.wait(0.3)

        # STEP 6: Highlight the outside elements with a note
        outside_note = Text("Not in A or B", font_size=16, color=GRAY_B, slant=ITALIC)
        outside_note.move_to(universal_box.get_edge_center(DOWN) + UP * 0.4)

        self.play(
            LaggedStart(*[FadeIn(n, scale=1.5) for n in outside_nums], lag_ratio=0.15),
            FadeIn(outside_note),
            run_time=0.8
        )

        # STEP 7: Add intersection label
        intersection_label = MathTex(r"A \cap B", font_size=20, color=YELLOW)
        intersection_label.next_to(intersection_num, DOWN, buff=0.25)

        self.play(Write(intersection_label))

        self.wait(2)


# Continue with remaining scenes...
# (I'll create the rest in the next response to keep the file manageable)

class SummaryScene(Scene):
    """Final scene: Summary"""

    def construct(self):
        title = Text("Set Theory Summary", font_size=50, color=PURPLE_C)
        title.to_edge(UP)

        summary_box = Rectangle(width=11, height=6, color=PURPLE_C, fill_opacity=0.05)
        summary_box.next_to(title, DOWN, buff=0.6)

        summary_points = VGroup(
            MathTex(r"\checkmark \text{ Sets use curly braces: } A = \{1, 2, 3\}", font_size=32),
            MathTex(r"\checkmark \text{ Intersection } (A \cap B): \text{ Common elements}", font_size=32),
            Text("   Example: {2, 3}", font_size=26, color=GRAY),
            MathTex(r"\checkmark \text{ Union } (A \cup B): \text{ All unique elements}", font_size=32),
            Text("   Example: {1, 2, 3, 4}", font_size=26, color=GRAY),
            MathTex(r"\checkmark \text{ Universal Set } (\xi): \text{ All possible elements}", font_size=32),
            MathTex(r"\checkmark \text{ Complement } (A'): \text{ Elements NOT in A}", font_size=32),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        summary_points.move_to(summary_box.get_center())

        self.play(Write(title))
        self.play(Create(summary_box))

        for point in summary_points:
            self.play(Write(point), run_time=0.8)
            self.wait(0.2)

        self.wait(3)
