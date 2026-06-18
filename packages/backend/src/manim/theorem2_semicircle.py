"""
Circle Theorem #2: Angle in a Semicircle
"If AB is a diameter, angle ACB = 90\u00b0 for any C on the circle."
Blueprint style \u00b7 SA Matric / IGCSE \u00b7 TikTok 9:16

Single scene \u2014 timed to ~68s narration.
"""

from manim import *
import numpy as np

# ======================================================================
# CONFIG
# ======================================================================

config.pixel_width = 1080
config.pixel_height = 1920
config.frame_width = 9
config.frame_height = 16
config.frame_rate = 30

# ======================================================================
# BLUEPRINT PALETTE
# ======================================================================

BG        = "#1e3a5f"
PRIMARY   = "#87CEEB"   # light blue
SECONDARY = "#FFD700"   # gold
ACCENT    = "#FF6B6B"   # coral/red
WHITE_BP  = "#d0e4f7"   # slightly tinted white for blueprint feel
GRID_CLR  = "#264a6e"   # subtle grid lines

# ======================================================================
# GEOMETRY
# ======================================================================

OO = np.array([0, 0.8, 0])   # circle centre
R  = 2.2                      # radius

# Diameter endpoints: A on right, B on left
A_ANG = 0.0
B_ANG = PI
C_ANG = PI * 0.65  # upper-left area of semicircle

# ======================================================================
# HELPERS
# ======================================================================

def pt(angle, centre=OO, radius=R):
    return centre + radius * np.array([np.cos(angle), np.sin(angle), 0])


def glow(mob, layers=3, extra=8):
    """Blueprint glow \u2014 softer than neon, still visible."""
    g = VGroup()
    w = mob.get_stroke_width()
    for i in range(layers):
        lyr = mob.copy()
        lyr.set_stroke(
            width=w + extra * (layers - i) / layers,
            opacity=0.08 * (i + 1),
        )
        g.add(lyr)
    g.add(mob.copy())
    return g


def glow_circle(centre=OO, radius=R, color=PRIMARY):
    c = Circle(radius=radius, stroke_color=color, stroke_width=2)
    c.move_to(centre)
    return glow(c)


def angle_arc(vertex, p1, p2, radius=0.5, **kw):
    """Arc showing the angle at vertex between directions to p1 and p2."""
    d1 = (p1 - vertex)[:2]
    d2 = (p2 - vertex)[:2]
    a1 = float(np.arctan2(d1[1], d1[0]))
    a2 = float(np.arctan2(d2[1], d2[0]))
    diff = (a2 - a1 + PI) % TAU - PI
    if diff < 0:
        return Arc(radius=radius, start_angle=a2, angle=-diff,
                   arc_center=vertex, **kw)
    return Arc(radius=radius, start_angle=a1, angle=diff,
               arc_center=vertex, **kw)


def angle_label_pos(vertex, p1, p2, offset=0.8):
    """Position for an angle label along the bisector."""
    d1 = (p1 - vertex)[:3]
    d2 = (p2 - vertex)[:3]
    d1n = d1 / np.linalg.norm(d1)
    d2n = d2 / np.linalg.norm(d2)
    bisector = d1n + d2n
    norm = np.linalg.norm(bisector)
    if norm < 1e-6:
        bisector = np.array([0, 1, 0])
    else:
        bisector = bisector / norm
    return vertex + bisector * offset


def right_angle_marker(vertex, p1, p2, size=0.3, **kw):
    """Draw a right-angle square at vertex toward p1 and p2."""
    d1 = (p1 - vertex)[:3]
    d2 = (p2 - vertex)[:3]
    d1n = d1 / np.linalg.norm(d1)
    d2n = d2 / np.linalg.norm(d2)
    corner1 = vertex + d1n * size
    mid = vertex + d1n * size + d2n * size
    corner2 = vertex + d2n * size
    return VGroup(
        Line(corner1, mid, **kw),
        Line(mid, corner2, **kw),
    )


def dim_tick(point, direction, length=0.15, **kw):
    """Small perpendicular dimension tick at a point."""
    perp = np.array([-direction[1], direction[0], 0])
    perp = perp / np.linalg.norm(perp) * length
    return Line(point - perp, point + perp, **kw)


def fadeall(scene, dur=0.3):
    if scene.mobjects:
        scene.play(*[FadeOut(m) for m in scene.mobjects], run_time=dur)


# ======================================================================
# BLUEPRINT GRID BACKGROUND
# ======================================================================

def blueprint_grid():
    """Faint grid lines for blueprint feel."""
    lines = VGroup()
    for x in np.arange(-4.5, 5, 1):
        lines.add(Line(
            [x, -8, 0], [x, 8, 0],
            stroke_color=GRID_CLR, stroke_width=0.5, stroke_opacity=0.4,
        ))
    for y in np.arange(-8, 9, 1):
        lines.add(Line(
            [-4.5, y, 0], [4.5, y, 0],
            stroke_color=GRID_CLR, stroke_width=0.5, stroke_opacity=0.4,
        ))
    return lines


# ======================================================================
# THE THEOREM VIDEO
# ======================================================================

class Theorem2_Semicircle(Scene):
    def construct(self):
        self.camera.background_color = BG

        # Add blueprint grid
        grid = blueprint_grid()
        self.add(grid)

        A = pt(A_ANG)
        B = pt(B_ANG)
        C = pt(C_ANG)

        # --- HOOK (7s) ----------------------------------------
        t_num = Text("THEOREM #2", font_size=34, color=ACCENT, weight=BOLD)
        t_line = Text("Shows up in", font_size=34, color=WHITE_BP)
        t_every = Text("EVERY paper.", font_size=48, color=SECONDARY, weight=BOLD)
        hook = VGroup(t_num, t_line, t_every).arrange(DOWN, buff=0.4)

        self.play(FadeIn(hook, scale=1.1), run_time=0.6)
        self.wait(6.5)
        fadeall(self)
        self.add(grid)

        # --- STATEMENT (8s) -----------------------------------
        title = Text("ANGLE IN A SEMICIRCLE", font_size=30, color=ACCENT, weight=BOLD)
        title.move_to(UP * 7)

        rule_l = Text("Diameter", font_size=28, color=ACCENT)
        rule_arrow = Text("\u2192", font_size=32, color=SECONDARY, weight=BOLD)
        rule_r = Text("90\u00b0 at circumference", font_size=28, color=PRIMARY)
        rule = VGroup(rule_l, rule_arrow, rule_r).arrange(RIGHT, buff=0.15)
        rule.move_to(UP * 5.8)

        self.play(Write(title), run_time=0.4)
        self.play(FadeIn(rule), run_time=0.4)
        self.wait(7.5)

        # --- SETUP (10s) --------------------------------------
        cg = glow_circle()

        o_dot = Dot(OO, radius=0.07, color=WHITE_BP)
        a_dot = Dot(A, radius=0.07, color=PRIMARY)
        b_dot = Dot(B, radius=0.07, color=PRIMARY)

        o_lbl = Text("O", font_size=20, color=WHITE_BP).next_to(o_dot, DOWN, buff=0.12)
        a_lbl = Text("A", font_size=20, color=PRIMARY).next_to(a_dot, RIGHT, buff=0.12)
        b_lbl = Text("B", font_size=20, color=PRIMARY).next_to(b_dot, LEFT, buff=0.12)

        # Diameter as dashed line
        diameter = DashedLine(A, B, stroke_color=SECONDARY, stroke_width=3,
                              dash_length=0.15)
        dia_glow = glow(diameter, layers=2, extra=5)

        # Dimension ticks at diameter endpoints
        dir_ab = (A - B)[:3]
        dir_ab = dir_ab / np.linalg.norm(dir_ab)
        tick_a = dim_tick(A, dir_ab, length=0.12,
                         stroke_color=SECONDARY, stroke_width=2)
        tick_b = dim_tick(B, dir_ab, length=0.12,
                         stroke_color=SECONDARY, stroke_width=2)

        # Point C
        c_dot = Dot(C, radius=0.07, color=ACCENT)
        c_lbl = Text("C", font_size=20, color=ACCENT).next_to(c_dot, UL, buff=0.1)

        # Lines CA and CB
        ca = Line(C, A, stroke_color=ACCENT, stroke_width=2)
        cb = Line(C, B, stroke_color=ACCENT, stroke_width=2)
        ca_g = glow(ca, layers=2, extra=5)
        cb_g = glow(cb, layers=2, extra=5)

        # Right angle marker at C
        ra_marker = right_angle_marker(C, A, B, size=0.25,
                                       stroke_color=SECONDARY, stroke_width=2.5)
        ra_label = Text("90\u00b0", font_size=22, color=SECONDARY, weight=BOLD)
        ra_label.move_to(angle_label_pos(C, A, B, offset=0.65))

        self.play(Create(cg), run_time=0.6)
        self.play(
            FadeIn(o_dot), Write(o_lbl),
            FadeIn(a_dot), Write(a_lbl),
            FadeIn(b_dot), Write(b_lbl),
            run_time=0.5,
        )
        self.play(Create(dia_glow), FadeIn(tick_a), FadeIn(tick_b), run_time=0.5)
        self.play(FadeIn(c_dot), Write(c_lbl), run_time=0.3)
        self.play(Create(ca_g), Create(cb_g), run_time=0.5)
        self.play(Create(ra_marker), Write(ra_label), run_time=0.5)
        self.wait(6.5)

        # --- MOVE C (8s) --------------------------------------
        self.play(
            FadeOut(c_dot), FadeOut(c_lbl),
            FadeOut(ca_g), FadeOut(cb_g),
            FadeOut(ra_marker), FadeOut(ra_label),
            run_time=0.3,
        )

        c_tracker = ValueTracker(C_ANG)

        def get_c():
            return pt(c_tracker.get_value())

        dyn_c_dot = always_redraw(lambda: Dot(get_c(), radius=0.08, color=ACCENT))
        dyn_ca = always_redraw(lambda: Line(get_c(), A,
                                            stroke_color=ACCENT, stroke_width=2))
        dyn_cb = always_redraw(lambda: Line(get_c(), B,
                                            stroke_color=ACCENT, stroke_width=2))

        def make_ra():
            c_now = get_c()
            return right_angle_marker(c_now, A, B, size=0.25,
                                      stroke_color=SECONDARY, stroke_width=2.5)

        dyn_ra = always_redraw(make_ra)
        dyn_ra_lbl = always_redraw(lambda:
            Text("90\u00b0", font_size=22, color=SECONDARY, weight=BOLD).move_to(
                angle_label_pos(get_c(), A, B, offset=0.65)
            )
        )

        self.add(dyn_c_dot, dyn_ca, dyn_cb, dyn_ra, dyn_ra_lbl)

        # Sweep C along upper semicircle
        self.play(c_tracker.animate.set_value(PI * 0.85), run_time=1.5,
                  rate_func=smooth)
        self.play(c_tracker.animate.set_value(PI * 0.15), run_time=2.5,
                  rate_func=smooth)
        self.play(c_tracker.animate.set_value(PI * 0.5), run_time=1.5,
                  rate_func=smooth)
        self.wait(2.5)

        # --- WHY IT WORKS (7s) --------------------------------
        why_box = RoundedRectangle(
            width=7.5, height=2.2, corner_radius=0.15,
            fill_color=BG, fill_opacity=0.92,
            stroke_color=SECONDARY, stroke_width=1.5,
        ).move_to(DOWN * 5)

        why1 = Text("Diameter = 180\u00b0 arc", font_size=24, color=WHITE_BP)
        why2 = Text("Inscribed angle = half", font_size=24, color=PRIMARY)
        why3 = Text("180\u00b0 \u00f7 2 = 90\u00b0", font_size=28, color=SECONDARY, weight=BOLD)
        why_grp = VGroup(why1, why2, why3).arrange(DOWN, buff=0.2)
        why_grp.move_to(why_box.get_center())

        self.play(FadeIn(why_box), run_time=0.3)
        self.play(FadeIn(why_grp), run_time=0.5)
        self.wait(6.5)

        # --- TRANSITION TO EXAMPLES ---------------------------
        fadeall(self, dur=0.4)
        self.add(grid)
        self.wait(0.2)

        # --- EXAMPLE 1 (9s) -----------------------------------
        ex_title = Text("EXAM QUESTION", font_size=28, color=SECONDARY, weight=BOLD)
        ex_title.move_to(UP * 7)

        ex_oo = np.array([0, 2.0, 0])
        ex_r = 1.8

        ex_a = ex_oo + ex_r * np.array([1, 0, 0])          # right
        ex_b = ex_oo + ex_r * np.array([-1, 0, 0])         # left
        # C in upper semicircle
        c_ex_ang = PI * 0.6
        ex_c = ex_oo + ex_r * np.array([np.cos(c_ex_ang),
                                         np.sin(c_ex_ang), 0])

        ex_circle = Circle(radius=ex_r, stroke_color=PRIMARY,
                           stroke_width=2).move_to(ex_oo)
        ex_cg = glow(ex_circle, layers=2, extra=5)

        ex_diameter = DashedLine(ex_a, ex_b, stroke_color=SECONDARY,
                                 stroke_width=2.5, dash_length=0.12)
        ex_ca = Line(ex_c, ex_a, stroke_color=ACCENT, stroke_width=2)
        ex_cb = Line(ex_c, ex_b, stroke_color=ACCENT, stroke_width=2)

        # Labels
        ex_a_lbl = Text("A", font_size=18, color=PRIMARY).next_to(ex_a, RIGHT, buff=0.1)
        ex_b_lbl = Text("B", font_size=18, color=PRIMARY).next_to(ex_b, LEFT, buff=0.1)
        ex_c_lbl = Text("C", font_size=18, color=ACCENT).next_to(ex_c, UL, buff=0.1)

        # Angle CAB = 30 degrees
        ang_cab = angle_arc(ex_a, ex_c, ex_b, radius=0.35,
                            stroke_color=PRIMARY, stroke_width=2.5)
        ang_cab_lbl = Text("30\u00b0", font_size=20, color=PRIMARY, weight=BOLD)
        ang_cab_lbl.move_to(angle_label_pos(ex_a, ex_c, ex_b, offset=0.65))

        # Right angle at C
        ex_ra = right_angle_marker(ex_c, ex_a, ex_b, size=0.22,
                                   stroke_color=SECONDARY, stroke_width=2)
        ex_ra_lbl = Text("90\u00b0", font_size=18, color=SECONDARY, weight=BOLD)
        ex_ra_lbl.move_to(angle_label_pos(ex_c, ex_a, ex_b, offset=0.55))

        # Solution
        sol1 = Text("ACB = 90\u00b0 (diameter)", font_size=24, color=WHITE_BP)
        sol2 = Text("ABC = 180\u00b0 - 90\u00b0 - 30\u00b0", font_size=24, color=WHITE_BP)
        sol3 = Text("ABC = 60\u00b0", font_size=32, color=SECONDARY, weight=BOLD)
        sol = VGroup(sol1, sol2, sol3).arrange(DOWN, buff=0.25)
        sol.move_to(DOWN * 4.5)

        self.play(Write(ex_title), run_time=0.3)
        self.play(Create(ex_cg), run_time=0.4)
        self.play(Create(ex_diameter), run_time=0.3)
        self.play(
            FadeIn(ex_a_lbl), FadeIn(ex_b_lbl), FadeIn(ex_c_lbl),
            Create(ex_ca), Create(ex_cb),
            run_time=0.4,
        )
        self.play(Create(ang_cab), Write(ang_cab_lbl), run_time=0.3)
        self.play(Create(ex_ra), Write(ex_ra_lbl), run_time=0.3)
        self.wait(1.5)
        self.play(FadeIn(sol1), run_time=0.3)
        self.play(FadeIn(sol2), run_time=0.3)
        self.wait(0.5)
        self.play(FadeIn(sol3, scale=1.2), run_time=0.4)
        self.wait(5.0)

        # --- EXAMPLE 2 (8s) -----------------------------------
        fadeall(self, dur=0.3)
        self.add(grid)
        self.wait(0.2)

        ex2_title = Text("REVERSE IT", font_size=28, color=SECONDARY, weight=BOLD)
        ex2_title.move_to(UP * 7)

        # Reuse same geometry
        ex2_circle = Circle(radius=ex_r, stroke_color=PRIMARY,
                            stroke_width=2).move_to(ex_oo)
        ex2_cg = glow(ex2_circle, layers=2, extra=5)

        ex2_a_lbl = Text("A", font_size=18, color=PRIMARY).next_to(ex_a, RIGHT, buff=0.1)
        ex2_b_lbl = Text("B", font_size=18, color=PRIMARY).next_to(ex_b, LEFT, buff=0.1)
        ex2_c_lbl = Text("C", font_size=18, color=ACCENT).next_to(ex_c, UL, buff=0.1)

        ex2_ca = Line(ex_c, ex_a, stroke_color=ACCENT, stroke_width=2)
        ex2_cb = Line(ex_c, ex_b, stroke_color=ACCENT, stroke_width=2)
        ex2_ab = Line(ex_a, ex_b, stroke_color=PRIMARY, stroke_width=2)

        # Right angle at C shown
        ex2_ra = right_angle_marker(ex_c, ex_a, ex_b, size=0.22,
                                    stroke_color=SECONDARY, stroke_width=2)
        ex2_ra_lbl = Text("90\u00b0", font_size=20, color=SECONDARY, weight=BOLD)
        ex2_ra_lbl.move_to(angle_label_pos(ex_c, ex_a, ex_b, offset=0.55))

        # Question and answer
        q_text = Text("Angle ACB = 90\u00b0", font_size=26, color=WHITE_BP)
        q_text2 = Text("What can you conclude?", font_size=24, color=PRIMARY)
        q_grp = VGroup(q_text, q_text2).arrange(DOWN, buff=0.2)
        q_grp.move_to(DOWN * 3.5)

        ans = Text("AB must be a diameter", font_size=30, color=SECONDARY, weight=BOLD)
        ans.move_to(DOWN * 5.5)

        self.play(Write(ex2_title), run_time=0.3)
        self.play(Create(ex2_cg), run_time=0.4)
        self.play(
            FadeIn(ex2_a_lbl), FadeIn(ex2_b_lbl), FadeIn(ex2_c_lbl),
            Create(ex2_ca), Create(ex2_cb), Create(ex2_ab),
            run_time=0.4,
        )
        self.play(Create(ex2_ra), Write(ex2_ra_lbl), run_time=0.3)
        self.wait(1.0)
        self.play(FadeIn(q_grp), run_time=0.4)
        self.wait(2.0)
        self.play(FadeIn(ans, scale=1.15), run_time=0.5)

        # Flash diameter to confirm
        dia_flash = DashedLine(ex_a, ex_b, stroke_color=SECONDARY,
                               stroke_width=4, dash_length=0.15)
        self.play(Create(dia_flash), run_time=0.4)
        self.wait(3.5)

        # --- CTA (5s) -----------------------------------------
        fadeall(self, dur=0.3)
        self.add(grid)
        self.wait(0.2)

        cta1 = Text("FOLLOW", font_size=48, color=PRIMARY, weight=BOLD)
        cta2 = Text("for Theorem #3", font_size=32, color=WHITE_BP)
        cta3 = Text("SAVE THIS SERIES.", font_size=30, color=SECONDARY, weight=BOLD)
        cta = VGroup(cta1, cta2, cta3).arrange(DOWN, buff=0.5)

        self.play(FadeIn(cta, shift=UP * 0.3), run_time=0.5)
        self.wait(5.0)
        fadeall(self, dur=0.4)
