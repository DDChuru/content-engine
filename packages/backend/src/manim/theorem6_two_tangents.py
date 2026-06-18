"""
Circle Theorem #6: Two Tangents from External Point
"Two tangents from the same external point are equal in length"
Gradient Wave style · SA Matric / IGCSE · TikTok 9:16

Single scene — timed to ~68s narration.
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
# GRADIENT WAVE PALETTE
# ═══════════════════════════════════════════════════════════

BG     = "#0a0a1a"
WARM1  = "#ff6b6b"   # coral
WARM2  = "#feca57"   # yellow
COOL   = "#48dbfb"   # sky blue
ACCENT = "#ff9ff3"   # pink

# ═══════════════════════════════════════════════════════════
# GEOMETRY
# ═══════════════════════════════════════════════════════════

OO = np.array([0, 1.0, 0])    # circle centre
R  = 2.0                       # radius
T  = np.array([0, -4.0, 0])   # external point below circle

# Tangent point calculation
_dist_OT = np.linalg.norm(T - OO)  # distance from O to T
_half_angle = np.arccos(R / _dist_OT)
_base_angle = np.arctan2((T - OO)[1], (T - OO)[0])  # angle from O toward T

# Tangent points A (right) and B (left)
A_ANG = _base_angle + _half_angle   # tangent point on right side
B_ANG = _base_angle - _half_angle   # tangent point on left side


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
    c = Circle(radius=R, stroke_color=COOL, stroke_width=2)
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
    """Position for an angle label -- along the bisector, offset from vertex."""
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


def right_angle_mark(vertex, p1, p2, size=0.25, **kw):
    """Draw a small right-angle square at vertex."""
    d1 = (p1 - vertex)[:3]
    d2 = (p2 - vertex)[:3]
    d1n = d1 / np.linalg.norm(d1) * size
    d2n = d2 / np.linalg.norm(d2) * size
    corner1 = vertex + d1n
    corner2 = vertex + d1n + d2n
    corner3 = vertex + d2n
    return VGroup(
        Line(corner1, corner2, **kw),
        Line(corner2, corner3, **kw),
    )


# ═══════════════════════════════════════════════════════════
# THE THEOREM VIDEO
# ═══════════════════════════════════════════════════════════

class Theorem6_TwoTangents(Scene):
    def construct(self):
        self.camera.background_color = BG

        A = pt(A_ANG)
        B = pt(B_ANG)

        # ─── HOOK (7s) ─────────────────────────────────
        t_num = Text("THEOREM #6", font_size=34, color=ACCENT, weight=BOLD)
        t_line = Text("This shortcut saves", font_size=36, color=WHITE)
        t_half = Text("REAL TIME.", font_size=48, color=WARM2, weight=BOLD)
        hook = VGroup(t_num, t_line, t_half).arrange(DOWN, buff=0.4)

        self.play(FadeIn(hook, scale=1.1), run_time=0.6)
        self.wait(6.5)
        fadeall(self)

        # ─── THEOREM STATEMENT (8s) ────────────────────
        title = Text("TWO TANGENTS THEOREM", font_size=28, color=ACCENT, weight=BOLD)
        title.move_to(UP * 7)

        rule_l = Text("Same external point", font_size=24, color=WARM1)
        rule_arrow = Text("\u2192", font_size=30, color=WARM2, weight=BOLD)
        rule_r = Text("Equal tangent lengths", font_size=24, color=COOL)
        rule = VGroup(rule_l, rule_arrow, rule_r).arrange(RIGHT, buff=0.15)
        rule.move_to(UP * 5.8)

        self.play(Write(title), run_time=0.4)
        self.play(FadeIn(rule), run_time=0.4)
        self.wait(6.5)

        # ─── SETUP (10s) ──────────────────────────────
        cg = neon_circle()

        o_dot = Dot(OO, radius=0.07, color=WHITE)
        t_dot = Dot(T, radius=0.08, color=WARM2)
        a_dot = Dot(A, radius=0.07, color=COOL)
        b_dot = Dot(B, radius=0.07, color=COOL)

        o_lbl = Text("O", font_size=20, color=WHITE).next_to(o_dot, UP, buff=0.12)
        t_lbl = Text("T", font_size=22, color=WARM2, weight=BOLD).next_to(t_dot, DOWN, buff=0.15)
        a_lbl = Text("A", font_size=20, color=COOL).next_to(a_dot, RIGHT, buff=0.12)
        b_lbl = Text("B", font_size=20, color=COOL).next_to(b_dot, LEFT, buff=0.12)

        # Tangent lines from T to A and T to B
        ta_line = Line(T, A, stroke_color=WARM1, stroke_width=2.5)
        tb_line = Line(T, B, stroke_color=WARM1, stroke_width=2.5)
        ta_g = neon(ta_line, layers=2, extra=6)
        tb_g = neon(tb_line, layers=2, extra=6)

        # TA = TB labels on the lines
        ta_mid = (T + A) / 2
        tb_mid = (T + B) / 2
        ta_label = Text("TA", font_size=20, color=WARM1).move_to(ta_mid + np.array([0.4, 0, 0]))
        tb_label = Text("TB", font_size=20, color=WARM1).move_to(tb_mid + np.array([-0.4, 0, 0]))

        self.play(Create(cg), run_time=0.5)
        self.play(
            FadeIn(o_dot), Write(o_lbl),
            FadeIn(t_dot), Write(t_lbl),
            run_time=0.4,
        )
        self.play(
            FadeIn(a_dot), Write(a_lbl),
            FadeIn(b_dot), Write(b_lbl),
            run_time=0.4,
        )
        self.play(Create(ta_g), Create(tb_g), run_time=0.6)
        self.play(Write(ta_label), Write(tb_label), run_time=0.3)

        # Show TA = TB
        eq_tangents = Text("TA = TB", font_size=32, color=WARM2, weight=BOLD)
        eq_tangents.move_to(DOWN * 5.5)
        self.play(FadeIn(eq_tangents, scale=1.2), run_time=0.4)
        self.wait(5.5)

        # ─── CONGRUENCE (8s) ──────────────────────────
        # Draw radii OA, OB
        oa_line = Line(OO, A, stroke_color=ACCENT, stroke_width=2)
        ob_line = Line(OO, B, stroke_color=ACCENT, stroke_width=2)
        ot_line = Line(OO, T, stroke_color=WHITE, stroke_width=1.5)
        oa_g = neon(oa_line, layers=2, extra=5)
        ob_g = neon(ob_line, layers=2, extra=5)

        # Right angle marks at A and B
        ra_a = right_angle_mark(A, OO, T, size=0.2, stroke_color=WARM2, stroke_width=2)
        ra_b = right_angle_mark(B, OO, T, size=0.2, stroke_color=WARM2, stroke_width=2)

        self.play(FadeOut(eq_tangents), run_time=0.2)
        self.play(Create(oa_g), Create(ob_g), run_time=0.4)
        self.play(Create(ot_line), run_time=0.3)
        self.play(Create(ra_a), Create(ra_b), run_time=0.3)

        # Congruence text
        cong_box = RoundedRectangle(
            width=7.5, height=2.8, corner_radius=0.2,
            fill_color=BG, fill_opacity=0.9,
            stroke_color=ACCENT, stroke_width=1,
        ).move_to(DOWN * 5.5)

        cong1 = Text("OA = OB  (radii)", font_size=20, color=ACCENT)
        cong2 = Text("OT = OT  (common)", font_size=20, color=WHITE)
        cong3 = Text("90\u00b0 at A and B  (tangent)", font_size=20, color=WARM2)
        cong4 = Text("\u25b3OTA \u2245 \u25b3OTB  (RHS)", font_size=22, color=COOL, weight=BOLD)
        cong_grp = VGroup(cong1, cong2, cong3, cong4).arrange(DOWN, buff=0.2)
        cong_grp.move_to(cong_box.get_center())

        self.play(FadeIn(cong_box), run_time=0.2)
        self.play(FadeIn(cong_grp), run_time=0.5)
        self.wait(6.0)

        # ─── VISUAL PROOF (7s) ────────────────────────
        # Highlight congruent triangles
        self.play(FadeOut(cong_box), FadeOut(cong_grp), run_time=0.2)

        tri_ota = Polygon(OO, T, A,
            fill_color=WARM1, fill_opacity=0.2,
            stroke_color=WARM1, stroke_width=2,
        )
        tri_otb = Polygon(OO, T, B,
            fill_color=COOL, fill_opacity=0.2,
            stroke_color=COOL, stroke_width=2,
        )

        self.play(FadeIn(tri_ota), run_time=0.4)
        self.play(FadeIn(tri_otb), run_time=0.4)

        # Flash congruence symbol
        cong_sym = Text("\u2245", font_size=60, color=WARM2, weight=BOLD)
        cong_sym.move_to(DOWN * 5.5)
        self.play(FadeIn(cong_sym, scale=1.5), run_time=0.3)

        # Also show OT bisects angle ATB
        bisect_text = Text("OT bisects \u2220ATB", font_size=24, color=ACCENT)
        bisect_text.move_to(DOWN * 6.5)
        self.play(FadeIn(bisect_text), run_time=0.3)
        self.wait(5.0)

        # ─── WHY (6s) ─────────────────────────────────
        fadeall(self, dur=0.3)
        self.wait(0.2)

        why_box = RoundedRectangle(
            width=7.5, height=3.0, corner_radius=0.2,
            fill_color=BG, fill_opacity=0.9,
            stroke_color=WARM2, stroke_width=1,
        ).move_to(ORIGIN)

        why1 = Text("Radii equal", font_size=24, color=ACCENT)
        why2 = Text("OT shared", font_size=24, color=WHITE)
        why3 = Text("Right angles at tangent points", font_size=24, color=WARM2)
        why4 = Text("RHS congruence", font_size=28, color=COOL, weight=BOLD)
        why_grp = VGroup(why1, why2, why3, why4).arrange(DOWN, buff=0.3)
        why_grp.move_to(why_box.get_center())

        self.play(FadeIn(why_box), run_time=0.2)
        self.play(FadeIn(why_grp), run_time=0.5)
        self.wait(5.0)

        # ─── EXAMPLE 1 (8s) ──────────────────────────
        fadeall(self, dur=0.3)
        self.wait(0.2)

        ex_title = Text("EXAM QUESTION", font_size=28, color=WARM2, weight=BOLD)
        ex_title.move_to(UP * 7)

        # Fresh small circle
        ex_oo = np.array([0, 2.0, 0])
        ex_r = 1.6
        ex_circle = Circle(radius=ex_r, stroke_color=COOL, stroke_width=2).move_to(ex_oo)
        ex_cg = neon(ex_circle, layers=2, extra=6)

        # External point below
        ex_t = np.array([0, -3.0, 0])
        ex_dist = np.linalg.norm(ex_t - ex_oo)
        ex_half = np.arccos(ex_r / ex_dist)
        ex_base = np.arctan2((ex_t - ex_oo)[1], (ex_t - ex_oo)[0])
        ex_a = ex_oo + ex_r * np.array([np.cos(ex_base + ex_half), np.sin(ex_base + ex_half), 0])
        ex_b = ex_oo + ex_r * np.array([np.cos(ex_base - ex_half), np.sin(ex_base - ex_half), 0])

        ex_ta = Line(ex_t, ex_a, stroke_color=WARM1, stroke_width=2.5)
        ex_tb = Line(ex_t, ex_b, stroke_color=WARM1, stroke_width=2.5)
        ex_t_dot = Dot(ex_t, radius=0.08, color=WARM2)
        ex_t_lbl = Text("T", font_size=20, color=WARM2).next_to(ex_t_dot, DOWN, buff=0.12)
        ex_a_dot = Dot(ex_a, radius=0.06, color=COOL)
        ex_b_dot = Dot(ex_b, radius=0.06, color=COOL)
        ex_a_lbl = Text("A", font_size=18, color=COOL).next_to(ex_a_dot, RIGHT, buff=0.1)
        ex_b_lbl = Text("B", font_size=18, color=COOL).next_to(ex_b_dot, LEFT, buff=0.1)

        # Label TA = 8
        ta_mid_ex = (ex_t + ex_a) / 2
        ta_val = Text("8 cm", font_size=22, color=WARM1, weight=BOLD)
        ta_val.move_to(ta_mid_ex + np.array([0.5, 0, 0]))

        # TB = ?
        tb_mid_ex = (ex_t + ex_b) / 2
        tb_q = Text("TB = ?", font_size=22, color=COOL, weight=BOLD)
        tb_q.move_to(tb_mid_ex + np.array([-0.6, 0, 0]))

        self.play(Write(ex_title), run_time=0.3)
        self.play(Create(ex_cg), run_time=0.4)
        self.play(
            FadeIn(ex_t_dot), Write(ex_t_lbl),
            FadeIn(ex_a_dot), Write(ex_a_lbl),
            FadeIn(ex_b_dot), Write(ex_b_lbl),
            run_time=0.4,
        )
        self.play(Create(ex_ta), Create(ex_tb), run_time=0.4)
        self.play(Write(ta_val), Write(tb_q), run_time=0.3)
        self.wait(1.5)

        # Solution
        sol1 = Text("Equal tangents from T", font_size=24, color=WHITE)
        sol2 = Text("TB = 8 cm", font_size=34, color=COOL, weight=BOLD)
        sol = VGroup(sol1, sol2).arrange(DOWN, buff=0.3)
        sol.move_to(DOWN * 5.5)

        self.play(FadeIn(sol1), run_time=0.3)
        self.wait(0.3)
        self.play(
            FadeIn(sol2, scale=1.2),
            tb_q.animate.become(
                Text("8 cm", font_size=22, color=COOL, weight=BOLD).move_to(tb_q.get_center())
            ),
            run_time=0.5,
        )
        self.wait(3.0)

        # ─── EXAMPLE 2 (8s) ──────────────────────────
        fadeall(self, dur=0.3)
        self.wait(0.2)

        ex2_title = Text("ANGLE QUESTION", font_size=28, color=WARM2, weight=BOLD)
        ex2_title.move_to(UP * 7)

        # Reuse same geometry
        ex2_circle = Circle(radius=ex_r, stroke_color=COOL, stroke_width=2).move_to(ex_oo)
        ex2_cg = neon(ex2_circle, layers=2, extra=6)
        ex2_oo_dot = Dot(ex_oo, radius=0.06, color=WHITE)
        ex2_oo_lbl = Text("O", font_size=18, color=WHITE).next_to(ex2_oo_dot, UP, buff=0.1)

        ex2_ta = Line(ex_t, ex_a, stroke_color=WARM1, stroke_width=2.5)
        ex2_tb = Line(ex_t, ex_b, stroke_color=WARM1, stroke_width=2.5)
        ex2_ot = Line(ex_oo, ex_t, stroke_color=WHITE, stroke_width=1.5)
        ex2_t_dot = Dot(ex_t, radius=0.08, color=WARM2)
        ex2_t_lbl = Text("T", font_size=20, color=WARM2).next_to(ex2_t_dot, DOWN, buff=0.12)
        ex2_a_dot = Dot(ex_a, radius=0.06, color=COOL)
        ex2_b_dot = Dot(ex_b, radius=0.06, color=COOL)
        ex2_a_lbl = Text("A", font_size=18, color=COOL).next_to(ex2_a_dot, RIGHT, buff=0.1)
        ex2_b_lbl = Text("B", font_size=18, color=COOL).next_to(ex2_b_dot, LEFT, buff=0.1)

        # Angle ATB = 50 degrees
        ang_atb = angle_arc(ex_t, ex_a, ex_b, radius=0.55, stroke_color=WARM2, stroke_width=3)
        ang_atb_lbl = Text("50\u00b0", font_size=22, color=WARM2, weight=BOLD)
        ang_atb_lbl.move_to(angle_label_pos(ex_t, ex_a, ex_b, offset=0.9))

        # OT bisector shown
        ang_ota_arc = angle_arc(ex_t, ex_a, ex_oo, radius=0.4, stroke_color=ACCENT, stroke_width=2)
        ang_ota_lbl = Text("\u2220OTA = ?", font_size=20, color=ACCENT, weight=BOLD)
        ang_ota_lbl.move_to(angle_label_pos(ex_t, ex_a, ex_oo, offset=0.8) + np.array([0.5, 0, 0]))

        self.play(Write(ex2_title), run_time=0.3)
        self.play(Create(ex2_cg), run_time=0.4)
        self.play(
            FadeIn(ex2_oo_dot), Write(ex2_oo_lbl),
            FadeIn(ex2_t_dot), Write(ex2_t_lbl),
            FadeIn(ex2_a_dot), Write(ex2_a_lbl),
            FadeIn(ex2_b_dot), Write(ex2_b_lbl),
            run_time=0.4,
        )
        self.play(Create(ex2_ta), Create(ex2_tb), Create(ex2_ot), run_time=0.4)
        self.play(Create(ang_atb), Write(ang_atb_lbl), run_time=0.3)
        self.play(Create(ang_ota_arc), Write(ang_ota_lbl), run_time=0.3)
        self.wait(1.5)

        # Solution
        sol2_1 = Text("OT bisects \u2220ATB", font_size=24, color=WHITE)
        sol2_2 = Text("50\u00b0 \u00f7 2 = 25\u00b0", font_size=28, color=WHITE)
        sol2_3 = Text("\u2220OTA = 25\u00b0", font_size=34, color=ACCENT, weight=BOLD)
        sol2_grp = VGroup(sol2_1, sol2_2, sol2_3).arrange(DOWN, buff=0.25)
        sol2_grp.move_to(DOWN * 5.5)

        self.play(FadeIn(sol2_1), run_time=0.3)
        self.wait(0.3)
        self.play(FadeIn(sol2_2), run_time=0.3)
        self.wait(0.3)
        self.play(
            FadeIn(sol2_3, scale=1.2),
            ang_ota_lbl.animate.become(
                Text("25\u00b0", font_size=20, color=ACCENT, weight=BOLD).move_to(ang_ota_lbl.get_center())
            ),
            run_time=0.5,
        )
        self.wait(3.0)

        # ─── CTA (5s) ──────────────────────────────────
        fadeall(self, dur=0.3)
        self.wait(0.2)

        cta1 = Text("FOLLOW", font_size=48, color=COOL, weight=BOLD)
        cta2 = Text("for Theorem #7", font_size=32, color=WHITE)
        cta3 = Text("SAVE THIS SERIES.", font_size=30, color=WARM2, weight=BOLD)
        cta = VGroup(cta1, cta2, cta3).arrange(DOWN, buff=0.5)

        self.play(FadeIn(cta, shift=UP * 0.3), run_time=0.5)
        self.wait(4.8)
        fadeall(self, dur=0.4)
