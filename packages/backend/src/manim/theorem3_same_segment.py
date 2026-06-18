"""
Circle Theorem #3: Angles in the Same Segment
"Angles subtended by the same chord from the same side are equal."
Shape Morphing style \u00b7 SA Matric / IGCSE \u00b7 TikTok 9:16

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
# SHAPE MORPHING PALETTE
# ======================================================================

BG        = "#0d1117"
PRIMARY   = "#7c4dff"   # vibrant purple
SECONDARY = "#00e5ff"   # bright cyan
ACCENT    = "#ff9100"   # orange
WHITE_SM  = "#e0e0e0"   # soft white
DIM       = "#4a5568"   # muted grey for deemphasised elements

# ======================================================================
# GEOMETRY
# ======================================================================

OO = np.array([0, 0.8, 0])   # circle centre
R  = 2.2                      # radius

# Chord endpoints
A_ANG = -PI / 6         # lower right
B_ANG = PI + PI / 6     # lower left
# Points in major (upper) segment
C_ANG = PI * 0.65
D_ANG = PI * 0.35

# ======================================================================
# HELPERS
# ======================================================================

def pt(angle, centre=OO, radius=R):
    return centre + radius * np.array([np.cos(angle), np.sin(angle), 0])


def morph_glow(mob, layers=3, extra=8):
    """Soft glow for the morphing style."""
    g = VGroup()
    w = mob.get_stroke_width()
    for i in range(layers):
        lyr = mob.copy()
        lyr.set_stroke(
            width=w + extra * (layers - i) / layers,
            opacity=0.07 * (i + 1),
        )
        g.add(lyr)
    g.add(mob.copy())
    return g


def morph_circle(centre=OO, radius=R, color=PRIMARY):
    c = Circle(radius=radius, stroke_color=color, stroke_width=2.5)
    c.move_to(centre)
    return morph_glow(c)


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


def fadeall(scene, dur=0.3):
    if scene.mobjects:
        scene.play(*[FadeOut(m) for m in scene.mobjects], run_time=dur)


# ======================================================================
# THE THEOREM VIDEO
# ======================================================================

class Theorem3_SameSegment(Scene):
    def construct(self):
        self.camera.background_color = BG

        A = pt(A_ANG)
        B = pt(B_ANG)
        C = pt(C_ANG)
        D = pt(D_ANG)

        # --- HOOK (7s) ----------------------------------------
        t_num = Text("THEOREM #3", font_size=34, color=ACCENT, weight=BOLD)
        t_line = Text("The one students", font_size=34, color=WHITE_SM)
        t_forget = Text("ALWAYS forget.", font_size=48, color=SECONDARY, weight=BOLD)
        hook = VGroup(t_num, t_line, t_forget).arrange(DOWN, buff=0.4)

        self.play(FadeIn(hook, scale=1.05), run_time=0.6)
        self.wait(6.5)

        # Morph hook out (shape morphing style: transform instead of fade)
        shrunk = hook.copy().scale(0.01).set_opacity(0)
        self.play(Transform(hook, shrunk), run_time=0.4)
        self.remove(hook)

        # --- STATEMENT (8s) -----------------------------------
        title = Text("SAME SEGMENT THEOREM", font_size=28, color=ACCENT, weight=BOLD)
        title.move_to(UP * 7)

        rule_l = Text("Same arc", font_size=28, color=ACCENT)
        rule_arrow = Text("\u2192", font_size=32, color=SECONDARY, weight=BOLD)
        rule_r = Text("Same angle", font_size=28, color=PRIMARY)
        rule = VGroup(rule_l, rule_arrow, rule_r).arrange(RIGHT, buff=0.15)
        rule.move_to(UP * 5.8)

        self.play(Write(title), run_time=0.4)
        self.play(FadeIn(rule), run_time=0.4)
        self.wait(7.0)

        # --- SETUP (10s) --------------------------------------
        cg = morph_circle()

        a_dot = Dot(A, radius=0.07, color=SECONDARY)
        b_dot = Dot(B, radius=0.07, color=SECONDARY)
        a_lbl = Text("A", font_size=20, color=SECONDARY).next_to(a_dot, DR, buff=0.1)
        b_lbl = Text("B", font_size=20, color=SECONDARY).next_to(b_dot, DL, buff=0.1)

        # Chord AB
        chord = Line(A, B, stroke_color=SECONDARY, stroke_width=2.5)
        chord_g = morph_glow(chord, layers=2, extra=5)

        # Point C and lines
        c_dot = Dot(C, radius=0.07, color=PRIMARY)
        c_lbl = Text("C", font_size=20, color=PRIMARY).next_to(c_dot, UL, buff=0.1)
        ca = Line(C, A, stroke_color=PRIMARY, stroke_width=2)
        cb = Line(C, B, stroke_color=PRIMARY, stroke_width=2)
        ca_g = morph_glow(ca, layers=2, extra=4)
        cb_g = morph_glow(cb, layers=2, extra=4)

        # Angle at C
        ang_c = angle_arc(C, A, B, radius=0.45,
                          stroke_color=PRIMARY, stroke_width=3)
        ang_c_lbl = Text("50\u00b0", font_size=22, color=PRIMARY, weight=BOLD)
        ang_c_lbl.move_to(angle_label_pos(C, A, B, offset=0.8))

        self.play(Create(cg), run_time=0.6)
        self.play(
            FadeIn(a_dot), Write(a_lbl),
            FadeIn(b_dot), Write(b_lbl),
            run_time=0.4,
        )
        self.play(Create(chord_g), run_time=0.4)
        self.play(FadeIn(c_dot), Write(c_lbl), run_time=0.3)
        self.play(Create(ca_g), Create(cb_g), run_time=0.5)
        self.play(Create(ang_c), Write(ang_c_lbl), run_time=0.4)
        self.wait(5.5)

        # --- SECOND POINT D (9s) ------------------------------
        d_dot = Dot(D, radius=0.07, color=ACCENT)
        d_lbl = Text("D", font_size=20, color=ACCENT).next_to(d_dot, UR, buff=0.1)
        da = Line(D, A, stroke_color=ACCENT, stroke_width=2)
        db = Line(D, B, stroke_color=ACCENT, stroke_width=2)
        da_g = morph_glow(da, layers=2, extra=4)
        db_g = morph_glow(db, layers=2, extra=4)

        ang_d = angle_arc(D, A, B, radius=0.45,
                          stroke_color=ACCENT, stroke_width=3)
        ang_d_lbl = Text("50\u00b0", font_size=22, color=ACCENT, weight=BOLD)
        ang_d_lbl.move_to(angle_label_pos(D, A, B, offset=0.8))

        # Morph D in (shape morphing: grow from chord midpoint)
        chord_mid = (A + B) / 2
        d_dot_start = Dot(chord_mid, radius=0.01, color=ACCENT).set_opacity(0)
        self.play(ReplacementTransform(d_dot_start, d_dot), run_time=0.4)
        self.play(Write(d_lbl), run_time=0.2)
        self.play(Create(da_g), Create(db_g), run_time=0.5)
        self.play(Create(ang_d), Write(ang_d_lbl), run_time=0.4)
        self.wait(1.5)

        # Flash equality
        eq = Text("angle ACB = angle ADB", font_size=28, color=SECONDARY, weight=BOLD)
        eq.move_to(DOWN * 5)
        self.play(FadeIn(eq, scale=1.15), run_time=0.4)
        self.wait(5.0)

        # --- MOVE POINTS (8s) ---------------------------------
        # Remove static C and D elements, add dynamic
        self.play(
            FadeOut(c_dot), FadeOut(c_lbl),
            FadeOut(ca_g), FadeOut(cb_g),
            FadeOut(ang_c), FadeOut(ang_c_lbl),
            FadeOut(d_dot), FadeOut(d_lbl),
            FadeOut(da_g), FadeOut(db_g),
            FadeOut(ang_d), FadeOut(ang_d_lbl),
            FadeOut(eq),
            run_time=0.3,
        )

        c_tracker = ValueTracker(C_ANG)
        d_tracker = ValueTracker(D_ANG)

        def get_c():
            return pt(c_tracker.get_value())

        def get_d():
            return pt(d_tracker.get_value())

        # Dynamic C elements
        dyn_c_dot = always_redraw(lambda: Dot(get_c(), radius=0.08, color=PRIMARY))
        dyn_ca = always_redraw(lambda: Line(get_c(), A,
                                            stroke_color=PRIMARY, stroke_width=2))
        dyn_cb = always_redraw(lambda: Line(get_c(), B,
                                            stroke_color=PRIMARY, stroke_width=2))
        dyn_ang_c = always_redraw(lambda: angle_arc(
            get_c(), A, B, radius=0.4, stroke_color=PRIMARY, stroke_width=3
        ))
        dyn_c_lbl = always_redraw(lambda:
            Text("50\u00b0", font_size=20, color=PRIMARY, weight=BOLD).move_to(
                angle_label_pos(get_c(), A, B, offset=0.75)
            )
        )

        # Dynamic D elements
        dyn_d_dot = always_redraw(lambda: Dot(get_d(), radius=0.08, color=ACCENT))
        dyn_da = always_redraw(lambda: Line(get_d(), A,
                                            stroke_color=ACCENT, stroke_width=2))
        dyn_db = always_redraw(lambda: Line(get_d(), B,
                                            stroke_color=ACCENT, stroke_width=2))
        dyn_ang_d = always_redraw(lambda: angle_arc(
            get_d(), A, B, radius=0.4, stroke_color=ACCENT, stroke_width=3
        ))
        dyn_d_lbl = always_redraw(lambda:
            Text("50\u00b0", font_size=20, color=ACCENT, weight=BOLD).move_to(
                angle_label_pos(get_d(), A, B, offset=0.75)
            )
        )

        self.add(dyn_c_dot, dyn_ca, dyn_cb, dyn_ang_c, dyn_c_lbl)
        self.add(dyn_d_dot, dyn_da, dyn_db, dyn_ang_d, dyn_d_lbl)

        # Sweep C and D around in the major segment (above chord)
        self.play(
            c_tracker.animate.set_value(PI * 0.85),
            d_tracker.animate.set_value(PI * 0.15),
            run_time=2.0, rate_func=smooth,
        )
        self.play(
            c_tracker.animate.set_value(PI * 0.4),
            d_tracker.animate.set_value(PI * 0.7),
            run_time=2.0, rate_func=smooth,
        )
        self.play(
            c_tracker.animate.set_value(PI * 0.6),
            d_tracker.animate.set_value(PI * 0.3),
            run_time=1.5, rate_func=smooth,
        )
        self.wait(2.0)

        # --- WHY IT WORKS (7s) --------------------------------
        why_box = RoundedRectangle(
            width=7.5, height=2.4, corner_radius=0.2,
            fill_color=BG, fill_opacity=0.92,
            stroke_color=ACCENT, stroke_width=1.5,
        ).move_to(DOWN * 5.2)

        why1 = Text("Both angles subtend arc AB", font_size=22, color=WHITE_SM)
        why2 = Text("Each = half the centre angle", font_size=22, color=PRIMARY)
        why3 = Text("Same arc \u2192 same angle", font_size=26, color=SECONDARY,
                     weight=BOLD)
        why_grp = VGroup(why1, why2, why3).arrange(DOWN, buff=0.22)
        why_grp.move_to(why_box.get_center())

        self.play(FadeIn(why_box), run_time=0.3)
        self.play(FadeIn(why_grp), run_time=0.5)
        self.wait(6.0)

        # --- TRANSITION TO EXAMPLES ---------------------------
        fadeall(self, dur=0.4)
        self.wait(0.2)

        # --- EXAMPLE 1 (8s) -----------------------------------
        ex_title = Text("EXAM QUESTION", font_size=28, color=ACCENT, weight=BOLD)
        ex_title.move_to(UP * 7)

        ex_oo = np.array([0, 2.0, 0])
        ex_r = 1.8

        ex_a = ex_oo + ex_r * np.array([np.cos(-PI / 6), np.sin(-PI / 6), 0])
        ex_b = ex_oo + ex_r * np.array([np.cos(PI + PI / 6),
                                         np.sin(PI + PI / 6), 0])
        ex_c = ex_oo + ex_r * np.array([np.cos(PI * 0.6),
                                         np.sin(PI * 0.6), 0])
        ex_d = ex_oo + ex_r * np.array([np.cos(PI * 0.3),
                                         np.sin(PI * 0.3), 0])

        ex_circle = Circle(radius=ex_r, stroke_color=PRIMARY,
                           stroke_width=2).move_to(ex_oo)
        ex_cg = morph_glow(ex_circle, layers=2, extra=5)

        ex_chord = Line(ex_a, ex_b, stroke_color=SECONDARY, stroke_width=2)

        # C lines and angle
        ex_ca = Line(ex_c, ex_a, stroke_color=PRIMARY, stroke_width=2)
        ex_cb = Line(ex_c, ex_b, stroke_color=PRIMARY, stroke_width=2)
        ex_ang_c = angle_arc(ex_c, ex_a, ex_b, radius=0.35,
                             stroke_color=PRIMARY, stroke_width=2.5)
        ex_c_lbl = Text("50\u00b0", font_size=20, color=PRIMARY, weight=BOLD)
        ex_c_lbl.move_to(angle_label_pos(ex_c, ex_a, ex_b, offset=0.65))

        # D lines and angle (unknown)
        ex_da = Line(ex_d, ex_a, stroke_color=ACCENT, stroke_width=2)
        ex_db = Line(ex_d, ex_b, stroke_color=ACCENT, stroke_width=2)
        ex_ang_d = angle_arc(ex_d, ex_a, ex_b, radius=0.35,
                             stroke_color=ACCENT, stroke_width=2.5)
        ex_d_q = Text("x = ?", font_size=20, color=ACCENT, weight=BOLD)
        ex_d_q.move_to(angle_label_pos(ex_d, ex_a, ex_b, offset=0.65))

        # Point labels
        exa_lbl = Text("A", font_size=18, color=SECONDARY).next_to(ex_a, DR, buff=0.1)
        exb_lbl = Text("B", font_size=18, color=SECONDARY).next_to(ex_b, DL, buff=0.1)
        exc_lbl = Text("C", font_size=18, color=PRIMARY).next_to(ex_c, UL, buff=0.1)
        exd_lbl = Text("D", font_size=18, color=ACCENT).next_to(ex_d, UR, buff=0.1)

        # Solution
        sol1 = Text("Same segment as C", font_size=26, color=WHITE_SM)
        sol2 = Text("x = 50\u00b0", font_size=34, color=SECONDARY, weight=BOLD)
        sol = VGroup(sol1, sol2).arrange(DOWN, buff=0.3)
        sol.move_to(DOWN * 4.5)

        self.play(Write(ex_title), run_time=0.3)
        self.play(Create(ex_cg), run_time=0.4)
        self.play(Create(ex_chord), run_time=0.3)
        self.play(
            FadeIn(exa_lbl), FadeIn(exb_lbl),
            FadeIn(exc_lbl), FadeIn(exd_lbl),
            run_time=0.3,
        )
        self.play(Create(ex_ca), Create(ex_cb), run_time=0.3)
        self.play(Create(ex_ang_c), Write(ex_c_lbl), run_time=0.3)
        self.play(Create(ex_da), Create(ex_db), run_time=0.3)
        self.play(Create(ex_ang_d), Write(ex_d_q), run_time=0.3)
        self.wait(1.5)
        self.play(FadeIn(sol1), run_time=0.3)
        self.wait(0.3)

        # Morph the "x = ?" into the answer
        ex_d_ans = Text("50\u00b0", font_size=20, color=ACCENT, weight=BOLD)
        ex_d_ans.move_to(ex_d_q.get_center())
        self.play(
            FadeIn(sol2, scale=1.2),
            Transform(ex_d_q, ex_d_ans),
            run_time=0.5,
        )
        self.wait(2.5)

        # --- EXAMPLE 2 (7s) -----------------------------------
        fadeall(self, dur=0.3)
        self.wait(0.2)

        ex2_title = Text("ONE MORE", font_size=28, color=ACCENT, weight=BOLD)
        ex2_title.move_to(UP * 7)

        ex2_circle = Circle(radius=ex_r, stroke_color=PRIMARY,
                            stroke_width=2).move_to(ex_oo)
        ex2_cg = morph_glow(ex2_circle, layers=2, extra=5)
        ex2_chord = Line(ex_a, ex_b, stroke_color=SECONDARY, stroke_width=2)

        # D has known angle
        ex2_da = Line(ex_d, ex_a, stroke_color=ACCENT, stroke_width=2)
        ex2_db = Line(ex_d, ex_b, stroke_color=ACCENT, stroke_width=2)
        ex2_ang_d = angle_arc(ex_d, ex_a, ex_b, radius=0.35,
                              stroke_color=ACCENT, stroke_width=2.5)
        ex2_d_lbl = Text("42\u00b0", font_size=20, color=ACCENT, weight=BOLD)
        ex2_d_lbl.move_to(angle_label_pos(ex_d, ex_a, ex_b, offset=0.65))

        # C has unknown angle
        ex2_ca = Line(ex_c, ex_a, stroke_color=PRIMARY, stroke_width=2)
        ex2_cb = Line(ex_c, ex_b, stroke_color=PRIMARY, stroke_width=2)
        ex2_ang_c = angle_arc(ex_c, ex_a, ex_b, radius=0.35,
                              stroke_color=PRIMARY, stroke_width=2.5)
        ex2_c_q = Text("y = ?", font_size=20, color=PRIMARY, weight=BOLD)
        ex2_c_q.move_to(angle_label_pos(ex_c, ex_a, ex_b, offset=0.65))

        # Labels
        ex2a_lbl = Text("A", font_size=18, color=SECONDARY).next_to(ex_a, DR, buff=0.1)
        ex2b_lbl = Text("B", font_size=18, color=SECONDARY).next_to(ex_b, DL, buff=0.1)
        ex2c_lbl = Text("C", font_size=18, color=PRIMARY).next_to(ex_c, UL, buff=0.1)
        ex2d_lbl = Text("D", font_size=18, color=ACCENT).next_to(ex_d, UR, buff=0.1)

        # Solution
        sol2_1 = Text("C in same segment as D", font_size=26, color=WHITE_SM)
        sol2_2 = Text("y = 42\u00b0", font_size=34, color=SECONDARY, weight=BOLD)
        sol2_grp = VGroup(sol2_1, sol2_2).arrange(DOWN, buff=0.3)
        sol2_grp.move_to(DOWN * 4.5)

        self.play(Write(ex2_title), run_time=0.3)
        self.play(Create(ex2_cg), run_time=0.4)
        self.play(Create(ex2_chord), run_time=0.3)
        self.play(
            FadeIn(ex2a_lbl), FadeIn(ex2b_lbl),
            FadeIn(ex2c_lbl), FadeIn(ex2d_lbl),
            run_time=0.3,
        )
        self.play(Create(ex2_da), Create(ex2_db), run_time=0.3)
        self.play(Create(ex2_ang_d), Write(ex2_d_lbl), run_time=0.3)
        self.play(Create(ex2_ca), Create(ex2_cb), run_time=0.3)
        self.play(Create(ex2_ang_c), Write(ex2_c_q), run_time=0.3)
        self.wait(1.0)
        self.play(FadeIn(sol2_1), run_time=0.3)
        self.wait(0.3)

        # Morph answer
        ex2_c_ans = Text("42\u00b0", font_size=20, color=PRIMARY, weight=BOLD)
        ex2_c_ans.move_to(ex2_c_q.get_center())
        self.play(
            FadeIn(sol2_2, scale=1.2),
            Transform(ex2_c_q, ex2_c_ans),
            run_time=0.5,
        )
        self.wait(2.5)

        # --- CTA (5s) -----------------------------------------
        fadeall(self, dur=0.3)
        self.wait(0.2)

        cta1 = Text("FOLLOW", font_size=48, color=SECONDARY, weight=BOLD)
        cta2 = Text("for Theorem #4", font_size=32, color=WHITE_SM)
        cta3 = Text("SAVE THIS SERIES.", font_size=30, color=ACCENT, weight=BOLD)
        cta = VGroup(cta1, cta2, cta3).arrange(DOWN, buff=0.5)

        # Morph in from centre point (shape morphing style)
        cta_start = cta.copy().scale(0.01).set_opacity(0)
        self.play(ReplacementTransform(cta_start, cta), run_time=0.6)
        self.wait(5.0)
        fadeall(self, dur=0.4)
