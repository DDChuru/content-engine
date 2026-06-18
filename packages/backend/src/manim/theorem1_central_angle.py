"""
Circle Theorem #1: Central Angle Theorem
"The angle at the centre = 2× the angle at the circumference"
Neon Glow style · SA Matric / IGCSE · TikTok 9:16

Single scene — timed to ~65s narration.
"""

from manim import *
import numpy as np

# ═══════════════════════════════════════════════════════════
# CONFIG
# ═══════════════════════════════════════════════════════════

config.pixel_width = 1080
config.pixel_height = 1920
config.frame_width = 9
config.frame_height = 16
config.frame_rate = 30

# ═══════════════════════════════════════════════════════════
# NEON GLOW PALETTE
# ═══════════════════════════════════════════════════════════

BG       = "#0a0a1a"
CYAN     = "#00ffff"
MAGENTA  = "#ff00ff"
PINK     = "#ff6ec7"
GOLD     = "#ffd93d"
NEON_RED = "#ff4444"

# ═══════════════════════════════════════════════════════════
# GEOMETRY
# ═══════════════════════════════════════════════════════════

OO = np.array([0, 0.5, 0])   # circle centre
R  = 2.2                      # radius

# Points for the main proof diagram
A_ANG = PI / 6       # 30° — upper right
B_ANG = 5 * PI / 6   # 150° — upper left
C_ANG = -PI / 2      # 270° — bottom (on major arc)


# ═══════════════════════════════════════════════════════════
# HELPERS
# ═══════════════════════════════════════════════════════════

def pt(angle, centre=OO, radius=R):
    return centre + radius * np.array([np.cos(angle), np.sin(angle), 0])


def neon(mob, layers=4, extra=10):
    g = VGroup()
    w = mob.get_stroke_width()
    for i in range(layers):
        lyr = mob.copy()
        lyr.set_stroke(
            width=w + extra * (layers - i) / layers,
            opacity=0.06 * (i + 1),
        )
        g.add(lyr)
    g.add(mob.copy())
    return g


def neon_circle():
    c = Circle(radius=R, stroke_color=CYAN, stroke_width=2)
    c.move_to(OO)
    return neon(c)


def angle_arc(vertex, p1, p2, radius=0.5, **kw):
    """Arc showing the angle at vertex between directions to p1 and p2 (shorter angle)."""
    d1 = (p1 - vertex)[:2]
    d2 = (p2 - vertex)[:2]
    a1 = float(np.arctan2(d1[1], d1[0]))
    a2 = float(np.arctan2(d2[1], d2[0]))
    diff = (a2 - a1 + PI) % TAU - PI
    if diff < 0:
        return Arc(radius=radius, start_angle=a2, angle=-diff, arc_center=vertex, **kw)
    return Arc(radius=radius, start_angle=a1, angle=diff, arc_center=vertex, **kw)


def angle_label_pos(vertex, p1, p2, offset=0.8):
    """Position for an angle label — along the bisector, offset from vertex."""
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


def fadeall(scene, dur=0.3):
    if scene.mobjects:
        scene.play(*[FadeOut(m) for m in scene.mobjects], run_time=dur)


# ═══════════════════════════════════════════════════════════
# THE THEOREM VIDEO
# ═══════════════════════════════════════════════════════════

class Theorem1_CentralAngle(Scene):
    def construct(self):
        self.camera.background_color = BG

        A = pt(A_ANG)
        B = pt(B_ANG)
        C = pt(C_ANG)

        # ─── HOOK (7s) ───────────────────────────────
        t_num = Text("THEOREM #1", font_size=34, color=MAGENTA, weight=BOLD)
        t_line = Text("This one rule solves", font_size=36, color=WHITE)
        t_half = Text("HALF your exam.", font_size=48, color=CYAN, weight=BOLD)
        hook = VGroup(t_num, t_line, t_half).arrange(DOWN, buff=0.4)

        self.play(FadeIn(hook, scale=1.1), run_time=0.6)
        self.wait(6.0)
        fadeall(self)

        # ─── THEOREM STATEMENT (8s) ──────────────────
        title = Text("CENTRAL ANGLE THEOREM", font_size=30, color=MAGENTA, weight=BOLD)
        title.move_to(UP * 7)

        rule_l = Text("Centre angle", font_size=26, color=MAGENTA)
        rule_eq = Text("= 2 \u00d7", font_size=30, color=GOLD, weight=BOLD)
        rule_r = Text("Circumference angle", font_size=26, color=CYAN)
        rule = VGroup(rule_l, rule_eq, rule_r).arrange(RIGHT, buff=0.15)
        rule.move_to(UP * 5.8)

        self.play(Write(title), run_time=0.4)
        self.play(FadeIn(rule), run_time=0.4)
        self.wait(6.5)

        # ─── PROOF SETUP (10s) ───────────────────────
        cg = neon_circle()

        o_dot = Dot(OO, radius=0.07, color=WHITE)
        a_dot = Dot(A, radius=0.07, color=CYAN)
        b_dot = Dot(B, radius=0.07, color=CYAN)

        o_lbl = Text("O", font_size=20, color=WHITE).next_to(o_dot, DOWN, buff=0.12)
        a_lbl = Text("A", font_size=20, color=CYAN).next_to(a_dot, UR, buff=0.1)
        b_lbl = Text("B", font_size=20, color=CYAN).next_to(b_dot, UL, buff=0.1)

        # Radii to A and B
        oa = Line(OO, A, stroke_color=MAGENTA, stroke_width=2)
        ob = Line(OO, B, stroke_color=MAGENTA, stroke_width=2)
        oa_g = neon(oa, layers=2, extra=6)
        ob_g = neon(ob, layers=2, extra=6)

        # Angle at centre
        ang_o = angle_arc(OO, A, B, radius=0.5, stroke_color=MAGENTA, stroke_width=3)
        ang_o_lbl = Text("120\u00b0", font_size=24, color=MAGENTA, weight=BOLD)
        ang_o_lbl.move_to(angle_label_pos(OO, A, B, offset=0.9))

        self.play(Create(cg), run_time=0.6)
        self.play(
            FadeIn(o_dot), Write(o_lbl),
            FadeIn(a_dot), Write(a_lbl),
            FadeIn(b_dot), Write(b_lbl),
            run_time=0.5,
        )
        self.play(Create(oa_g), Create(ob_g), run_time=0.5)
        self.play(Create(ang_o), Write(ang_o_lbl), run_time=0.5)
        self.wait(5.0)

        # ─── ADD POINT C (9s) ────────────────────────
        c_dot = Dot(C, radius=0.07, color=PINK)
        c_lbl = Text("C", font_size=20, color=PINK).next_to(c_dot, DOWN, buff=0.12)

        ca = Line(C, A, stroke_color=PINK, stroke_width=2)
        cb = Line(C, B, stroke_color=PINK, stroke_width=2)
        ca_g = neon(ca, layers=2, extra=5)
        cb_g = neon(cb, layers=2, extra=5)

        ang_c = angle_arc(C, A, B, radius=0.45, stroke_color=CYAN, stroke_width=3)
        ang_c_lbl = Text("60\u00b0", font_size=24, color=CYAN, weight=BOLD)
        ang_c_lbl.move_to(angle_label_pos(C, A, B, offset=0.85))

        self.play(FadeIn(c_dot), Write(c_lbl), run_time=0.3)
        self.play(Create(ca_g), Create(cb_g), run_time=0.5)
        self.play(Create(ang_c), Write(ang_c_lbl), run_time=0.5)
        self.wait(3.0)

        # Flash the relationship
        eq = Text("120\u00b0 = 2 \u00d7 60\u00b0", font_size=32, color=GOLD, weight=BOLD)
        eq.move_to(DOWN * 4.5)
        self.play(FadeIn(eq, scale=1.2), run_time=0.4)
        self.wait(3.0)

        # ─── MOVE C ALONG ARC (8s) ───────────────────
        # Remove static C elements, add dynamic ones
        self.play(
            FadeOut(c_dot), FadeOut(c_lbl),
            FadeOut(ca_g), FadeOut(cb_g),
            FadeOut(ang_c), FadeOut(ang_c_lbl),
            FadeOut(eq),
            run_time=0.3,
        )

        c_tracker = ValueTracker(C_ANG)

        def get_c():
            return pt(c_tracker.get_value())

        dyn_c_dot = always_redraw(lambda: Dot(get_c(), radius=0.08, color=PINK))
        dyn_ca = always_redraw(lambda: Line(get_c(), A, stroke_color=PINK, stroke_width=2))
        dyn_cb = always_redraw(lambda: Line(get_c(), B, stroke_color=PINK, stroke_width=2))
        dyn_ang = always_redraw(lambda: angle_arc(
            get_c(), A, B, radius=0.45, stroke_color=CYAN, stroke_width=3
        ))
        dyn_lbl = always_redraw(lambda:
            Text("60\u00b0", font_size=26, color=CYAN, weight=BOLD).move_to(
                angle_label_pos(get_c(), A, B, offset=0.85)
            )
        )

        self.add(dyn_c_dot, dyn_ca, dyn_cb, dyn_ang, dyn_lbl)

        # Sweep C along major arc
        self.play(c_tracker.animate.set_value(-PI / 4), run_time=1.5, rate_func=smooth)
        self.play(c_tracker.animate.set_value(-3 * PI / 4), run_time=2.0, rate_func=smooth)
        self.play(c_tracker.animate.set_value(-PI / 2), run_time=1.5, rate_func=smooth)

        self.wait(2.5)

        # ─── WHY IT WORKS (9s) ───────────────────────
        why_box = RoundedRectangle(
            width=7.5, height=2.5, corner_radius=0.2,
            fill_color=BG, fill_opacity=0.9,
            stroke_color=MAGENTA, stroke_width=1,
        ).move_to(DOWN * 5)

        why1 = Text("OA = OB = OC = radius", font_size=22, color=WHITE)
        why2 = Text("Isosceles triangles", font_size=22, color=GOLD)
        why3 = Text("Centre always = 2 \u00d7 circumference", font_size=22, color=CYAN, weight=BOLD)
        why_grp = VGroup(why1, why2, why3).arrange(DOWN, buff=0.25)
        why_grp.move_to(why_box.get_center())

        self.play(FadeIn(why_box), run_time=0.3)
        self.play(FadeIn(why_grp), run_time=0.5)
        self.wait(7.0)

        # ─── TRANSITION TO EXAMPLES ──────────────────
        fadeall(self, dur=0.4)
        self.wait(0.3)

        # ─── EXAMPLE 1 (10s) ─────────────────────────
        ex_title = Text("EXAM QUESTION", font_size=28, color=GOLD, weight=BOLD)
        ex_title.move_to(UP * 7)

        # Fresh circle (smaller, higher)
        ex_oo = np.array([0, 2, 0])
        ex_r = 1.8
        ex_circle = Circle(radius=ex_r, stroke_color=CYAN, stroke_width=2).move_to(ex_oo)
        ex_cg = neon(ex_circle, layers=2, extra=6)

        # Points
        ex_a = ex_oo + ex_r * np.array([np.cos(0), np.sin(0), 0])
        ex_b = ex_oo + ex_r * np.array([np.cos(2 * PI / 3), np.sin(2 * PI / 3), 0])
        ex_c = ex_oo + ex_r * np.array([np.cos(-PI / 2), np.sin(-PI / 2), 0])

        ex_oa = Line(ex_oo, ex_a, stroke_color=MAGENTA, stroke_width=2)
        ex_ob = Line(ex_oo, ex_b, stroke_color=MAGENTA, stroke_width=2)
        ex_ca = Line(ex_c, ex_a, stroke_color=PINK, stroke_width=2)
        ex_cb = Line(ex_c, ex_b, stroke_color=PINK, stroke_width=2)

        ex_ang_o = angle_arc(ex_oo, ex_a, ex_b, radius=0.4, stroke_color=MAGENTA, stroke_width=3)
        ex_o_lbl = Text("140\u00b0", font_size=24, color=MAGENTA, weight=BOLD)
        ex_o_lbl.move_to(angle_label_pos(ex_oo, ex_a, ex_b, offset=0.75))

        ex_ang_c = angle_arc(ex_c, ex_a, ex_b, radius=0.35, stroke_color=CYAN, stroke_width=3)
        ex_x_lbl = Text("x = ?", font_size=26, color=CYAN, weight=BOLD)
        ex_x_lbl.move_to(angle_label_pos(ex_c, ex_a, ex_b, offset=0.75))

        # Solution
        sol1 = Text("x = 140\u00b0 \u00f7 2", font_size=30, color=WHITE)
        sol2 = Text("x = 70\u00b0", font_size=36, color=CYAN, weight=BOLD)
        sol = VGroup(sol1, sol2).arrange(DOWN, buff=0.3)
        sol.move_to(DOWN * 4.5)

        self.play(Write(ex_title), run_time=0.3)
        self.play(Create(ex_cg), run_time=0.4)
        self.play(
            Create(ex_oa), Create(ex_ob),
            Create(ex_ca), Create(ex_cb),
            run_time=0.4,
        )
        self.play(Create(ex_ang_o), Write(ex_o_lbl), run_time=0.4)
        self.play(Create(ex_ang_c), Write(ex_x_lbl), run_time=0.4)
        self.wait(2.5)
        self.play(FadeIn(sol1), run_time=0.3)
        self.wait(0.5)
        self.play(
            FadeIn(sol2, scale=1.2),
            ex_x_lbl.animate.become(
                Text("70\u00b0", font_size=26, color=CYAN, weight=BOLD).move_to(ex_x_lbl.get_center())
            ),
            run_time=0.5,
        )
        self.wait(3.5)

        # ─── EXAMPLE 2 (8s) ─────────────────────────
        fadeall(self, dur=0.3)
        self.wait(0.2)

        ex2_title = Text("REVERSE IT", font_size=28, color=GOLD, weight=BOLD)
        ex2_title.move_to(UP * 7)

        # New circle
        ex2_circle = Circle(radius=ex_r, stroke_color=CYAN, stroke_width=2).move_to(ex_oo)
        ex2_cg = neon(ex2_circle, layers=2, extra=6)

        ex2_oa = Line(ex_oo, ex_a, stroke_color=MAGENTA, stroke_width=2)
        ex2_ob = Line(ex_oo, ex_b, stroke_color=MAGENTA, stroke_width=2)
        ex2_ca = Line(ex_c, ex_a, stroke_color=PINK, stroke_width=2)
        ex2_cb = Line(ex_c, ex_b, stroke_color=PINK, stroke_width=2)

        ex2_ang_o = angle_arc(ex_oo, ex_a, ex_b, radius=0.4, stroke_color=MAGENTA, stroke_width=3)
        ex2_o_lbl = Text("y = ?", font_size=26, color=MAGENTA, weight=BOLD)
        ex2_o_lbl.move_to(angle_label_pos(ex_oo, ex_a, ex_b, offset=0.75))

        ex2_ang_c = angle_arc(ex_c, ex_a, ex_b, radius=0.35, stroke_color=CYAN, stroke_width=3)
        ex2_c_lbl = Text("35\u00b0", font_size=24, color=CYAN, weight=BOLD)
        ex2_c_lbl.move_to(angle_label_pos(ex_c, ex_a, ex_b, offset=0.75))

        sol2_1 = Text("y = 35\u00b0 \u00d7 2", font_size=30, color=WHITE)
        sol2_2 = Text("y = 70\u00b0", font_size=36, color=MAGENTA, weight=BOLD)
        sol2_grp = VGroup(sol2_1, sol2_2).arrange(DOWN, buff=0.3)
        sol2_grp.move_to(DOWN * 4.5)

        self.play(Write(ex2_title), run_time=0.3)
        self.play(Create(ex2_cg), run_time=0.4)
        self.play(
            Create(ex2_oa), Create(ex2_ob),
            Create(ex2_ca), Create(ex2_cb),
            run_time=0.4,
        )
        self.play(Create(ex2_ang_c), Write(ex2_c_lbl), run_time=0.3)
        self.play(Create(ex2_ang_o), Write(ex2_o_lbl), run_time=0.3)
        self.wait(1.5)
        self.play(FadeIn(sol2_1), run_time=0.3)
        self.wait(0.5)
        self.play(
            FadeIn(sol2_2, scale=1.2),
            ex2_o_lbl.animate.become(
                Text("70\u00b0", font_size=26, color=MAGENTA, weight=BOLD).move_to(ex2_o_lbl.get_center())
            ),
            run_time=0.5,
        )
        self.wait(3.0)

        # ─── CTA (5s) ────────────────────────────────
        fadeall(self, dur=0.3)
        self.wait(0.2)

        cta1 = Text("FOLLOW", font_size=48, color=CYAN, weight=BOLD)
        cta2 = Text("for Theorem #2", font_size=32, color=WHITE)
        cta3 = Text("SAVE THIS SERIES.", font_size=30, color=GOLD, weight=BOLD)
        cta = VGroup(cta1, cta2, cta3).arrange(DOWN, buff=0.5)

        self.play(FadeIn(cta, shift=UP * 0.3), run_time=0.5)
        self.wait(4.8)
        fadeall(self, dur=0.4)
