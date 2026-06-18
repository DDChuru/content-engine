"""
Circle Theorem #4: Cyclic Quadrilateral
"Opposite angles of a cyclic quadrilateral sum to 180\u00b0"
Chalkboard style \u00b7 SA Matric / IGCSE \u00b7 TikTok 9:16

Single scene \u2014 timed to ~68s narration.
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
# CHALKBOARD PALETTE
# ═══════════════════════════════════════════════════════════

BG        = "#2d4a3e"
PRIMARY   = "#FFFFFF"
SECONDARY = "#FFD700"
ACCENT    = "#FF9999"
HIGHLIGHT = "#87CEEB"

# ═══════════════════════════════════════════════════════════
# GEOMETRY
# ═══════════════════════════════════════════════════════════

OO = np.array([0, 0.5, 0])   # circle centre
R  = 2.2                      # radius

# Points: A upper-right, B upper-left, C lower-left, D lower-right
A_ANG = np.radians(40)
B_ANG = np.radians(150)
C_ANG = np.radians(210)
D_ANG = np.radians(320)


# ═══════════════════════════════════════════════════════════
# HELPERS
# ═══════════════════════════════════════════════════════════

def pt(angle, centre=OO, radius=R):
    return centre + radius * np.array([np.cos(angle), np.sin(angle), 0])


def chalk_line(start, end, color=PRIMARY, width=3):
    """Thicker stroke for chalkboard feel."""
    return Line(start, end, stroke_color=color, stroke_width=width)


def chalk_circle(centre=OO, radius=R, color=PRIMARY, width=3):
    c = Circle(radius=radius, stroke_color=color, stroke_width=width)
    c.move_to(centre)
    return c


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
    """Position for an angle label \u2014 along the bisector, offset from vertex."""
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

class Theorem4_CyclicQuad(Scene):
    def construct(self):
        self.camera.background_color = BG

        A = pt(A_ANG)
        B = pt(B_ANG)
        C = pt(C_ANG)
        D = pt(D_ANG)

        # ─── HOOK (7s) ───────────────────────────────
        t_num = Text("THEOREM #4", font_size=34, color=SECONDARY, weight=BOLD)
        t_line = Text("This one is worth", font_size=36, color=PRIMARY)
        t_big = Text("BIG MARKS.", font_size=48, color=ACCENT, weight=BOLD)
        hook = VGroup(t_num, t_line, t_big).arrange(DOWN, buff=0.4)

        self.play(FadeIn(hook, scale=1.1), run_time=0.6)
        self.wait(3.0)
        fadeall(self)

        # ─── THEOREM STATEMENT (8s) ──────────────────
        title = Text("CYCLIC QUADRILATERAL", font_size=30, color=SECONDARY, weight=BOLD)
        title.move_to(UP * 7)

        rule_l = Text("Opposite angles", font_size=26, color=ACCENT)
        rule_eq = Text("= 180\u00b0", font_size=30, color=SECONDARY, weight=BOLD)
        rule = VGroup(rule_l, rule_eq).arrange(RIGHT, buff=0.15)
        rule.move_to(UP * 5.8)

        self.play(Write(title), run_time=0.4)
        self.play(FadeIn(rule), run_time=0.4)
        self.wait(7.0)

        # ─── SETUP (10s) ────────────────────────────
        circ = chalk_circle()

        a_dot = Dot(A, radius=0.07, color=SECONDARY)
        b_dot = Dot(B, radius=0.07, color=SECONDARY)
        c_dot = Dot(C, radius=0.07, color=SECONDARY)
        d_dot = Dot(D, radius=0.07, color=SECONDARY)

        a_lbl = Text("A", font_size=20, color=SECONDARY).next_to(a_dot, UR, buff=0.1)
        b_lbl = Text("B", font_size=20, color=SECONDARY).next_to(b_dot, UL, buff=0.1)
        c_lbl = Text("C", font_size=20, color=SECONDARY).next_to(c_dot, DL, buff=0.1)
        d_lbl = Text("D", font_size=20, color=SECONDARY).next_to(d_dot, DR, buff=0.1)

        # Quadrilateral sides
        ab = chalk_line(A, B, color=PRIMARY)
        bc = chalk_line(B, C, color=PRIMARY)
        cd = chalk_line(C, D, color=PRIMARY)
        da = chalk_line(D, A, color=PRIMARY)

        # Angle arcs at each vertex
        ang_a_arc = angle_arc(A, D, B, radius=0.4, stroke_color=ACCENT, stroke_width=3)
        ang_b_arc = angle_arc(B, A, C, radius=0.4, stroke_color=HIGHLIGHT, stroke_width=3)
        ang_c_arc = angle_arc(C, B, D, radius=0.4, stroke_color=ACCENT, stroke_width=3)
        ang_d_arc = angle_arc(D, C, A, radius=0.4, stroke_color=HIGHLIGHT, stroke_width=3)

        ang_a_lbl = Text("110\u00b0", font_size=20, color=ACCENT, weight=BOLD)
        ang_a_lbl.move_to(angle_label_pos(A, D, B, offset=0.75))
        ang_b_lbl = Text("65\u00b0", font_size=20, color=HIGHLIGHT, weight=BOLD)
        ang_b_lbl.move_to(angle_label_pos(B, A, C, offset=0.75))
        ang_c_lbl = Text("70\u00b0", font_size=20, color=ACCENT, weight=BOLD)
        ang_c_lbl.move_to(angle_label_pos(C, B, D, offset=0.75))
        ang_d_lbl = Text("115\u00b0", font_size=20, color=HIGHLIGHT, weight=BOLD)
        ang_d_lbl.move_to(angle_label_pos(D, C, A, offset=0.75))

        self.play(Create(circ), run_time=0.6)
        self.play(
            FadeIn(a_dot), Write(a_lbl),
            FadeIn(b_dot), Write(b_lbl),
            FadeIn(c_dot), Write(c_lbl),
            FadeIn(d_dot), Write(d_lbl),
            run_time=0.5,
        )
        self.play(Create(ab), Create(bc), Create(cd), Create(da), run_time=0.6)
        self.play(
            Create(ang_a_arc), Write(ang_a_lbl),
            Create(ang_b_arc), Write(ang_b_lbl),
            Create(ang_c_arc), Write(ang_c_lbl),
            Create(ang_d_arc), Write(ang_d_lbl),
            run_time=0.6,
        )
        self.wait(4.0)

        # ─── SHOW RELATIONSHIP (8s) ─────────────────
        # Highlight pair 1: A + C
        flash_a = ang_a_arc.copy().set_stroke(color=SECONDARY, width=5)
        flash_c = ang_c_arc.copy().set_stroke(color=SECONDARY, width=5)
        self.play(Create(flash_a), Create(flash_c), run_time=0.4)

        eq1 = Text("110\u00b0 + 70\u00b0 = 180\u00b0", font_size=28, color=SECONDARY, weight=BOLD)
        eq1.move_to(DOWN * 4)
        self.play(FadeIn(eq1, scale=1.1), run_time=0.4)
        self.wait(3.5)

        self.play(FadeOut(flash_a), FadeOut(flash_c), FadeOut(eq1), run_time=0.3)

        # Highlight pair 2: B + D
        flash_b = ang_b_arc.copy().set_stroke(color=SECONDARY, width=5)
        flash_d = ang_d_arc.copy().set_stroke(color=SECONDARY, width=5)
        self.play(Create(flash_b), Create(flash_d), run_time=0.4)

        eq2 = Text("65\u00b0 + 115\u00b0 = 180\u00b0", font_size=28, color=SECONDARY, weight=BOLD)
        eq2.move_to(DOWN * 4)
        self.play(FadeIn(eq2, scale=1.1), run_time=0.4)
        self.wait(3.5)

        self.play(FadeOut(flash_b), FadeOut(flash_d), FadeOut(eq2), run_time=0.3)

        # ─── MORPH QUAD (7s) ────────────────────────
        # Remove static geometry, build dynamic version
        self.play(
            FadeOut(ab), FadeOut(bc), FadeOut(cd), FadeOut(da),
            FadeOut(a_dot), FadeOut(b_dot), FadeOut(c_dot), FadeOut(d_dot),
            FadeOut(a_lbl), FadeOut(b_lbl), FadeOut(c_lbl), FadeOut(d_lbl),
            FadeOut(ang_a_arc), FadeOut(ang_b_arc), FadeOut(ang_c_arc), FadeOut(ang_d_arc),
            FadeOut(ang_a_lbl), FadeOut(ang_b_lbl), FadeOut(ang_c_lbl), FadeOut(ang_d_lbl),
            run_time=0.3,
        )

        morph_text = Text("Move the vertices...", font_size=24, color=PRIMARY)
        morph_text.move_to(UP * 4.8)
        self.play(FadeIn(morph_text), run_time=0.3)

        # Use a tracker to morph vertex B position
        b_tracker = ValueTracker(B_ANG)

        def get_b():
            return pt(b_tracker.get_value())

        # Dynamic quadrilateral
        dyn_a_dot = Dot(A, radius=0.07, color=SECONDARY)
        dyn_c_dot = Dot(C, radius=0.07, color=SECONDARY)
        dyn_d_dot = Dot(D, radius=0.07, color=SECONDARY)

        dyn_b_dot = always_redraw(lambda: Dot(get_b(), radius=0.07, color=SECONDARY))

        dyn_ab = always_redraw(lambda: chalk_line(A, get_b()))
        dyn_bc = always_redraw(lambda: chalk_line(get_b(), C))
        dyn_cd = chalk_line(C, D)
        dyn_da = chalk_line(D, A)

        # Dynamic angle labels: A and C are the opposite pair we track
        def compute_angle_a():
            """Inscribed angle at A subtending arc BCD (from B to D not through A)."""
            b_ang = b_tracker.get_value()
            # Arc from B to D not passing through A (going through C)
            # Inscribed angle = half the arc it subtends
            # Arc BCD = arc from B -> C -> D
            arc_bcd = (D_ANG - b_ang) % TAU
            return np.degrees(arc_bcd / 2)

        def compute_angle_c():
            """Inscribed angle at C subtending arc BAD (from B to D passing through A)."""
            ang_a = compute_angle_a()
            return 180 - ang_a

        dyn_ang_a_lbl = always_redraw(lambda:
            Text(
                "{:.0f}\u00b0".format(compute_angle_a()),
                font_size=20, color=ACCENT, weight=BOLD
            ).move_to(angle_label_pos(A, D, get_b(), offset=0.75))
        )
        dyn_ang_c_lbl = always_redraw(lambda:
            Text(
                "{:.0f}\u00b0".format(compute_angle_c()),
                font_size=20, color=ACCENT, weight=BOLD
            ).move_to(angle_label_pos(C, get_b(), D, offset=0.75))
        )

        sum_lbl = always_redraw(lambda:
            Text(
                "{:.0f}\u00b0 + {:.0f}\u00b0 = 180\u00b0".format(
                    compute_angle_a(), compute_angle_c()
                ),
                font_size=26, color=SECONDARY, weight=BOLD
            ).move_to(DOWN * 4.5)
        )

        self.add(
            dyn_a_dot, dyn_b_dot, dyn_c_dot, dyn_d_dot,
            dyn_ab, dyn_bc, dyn_cd, dyn_da,
            dyn_ang_a_lbl, dyn_ang_c_lbl, sum_lbl,
        )

        # Sweep B around
        self.play(b_tracker.animate.set_value(np.radians(120)), run_time=1.8, rate_func=smooth)
        self.play(b_tracker.animate.set_value(np.radians(170)), run_time=2.0, rate_func=smooth)
        self.play(b_tracker.animate.set_value(B_ANG), run_time=1.8, rate_func=smooth)
        self.wait(6.0)

        # ─── WHY (7s) ──────────────────────────────
        fadeall(self, dur=0.3)
        self.wait(0.2)

        why_title = Text("WHY?", font_size=32, color=SECONDARY, weight=BOLD)
        why_title.move_to(UP * 6.5)

        why1 = Text("Angle A = half arc BCD", font_size=22, color=ACCENT)
        why2 = Text("Angle C = half arc BAD", font_size=22, color=ACCENT)
        why3 = Text("Arcs BCD + BAD = 360\u00b0", font_size=22, color=PRIMARY)
        why4 = Text("Half of 360\u00b0 = 180\u00b0", font_size=26, color=SECONDARY, weight=BOLD)
        why_grp = VGroup(why1, why2, why3, why4).arrange(DOWN, buff=0.35)
        why_grp.move_to(ORIGIN)

        self.play(Write(why_title), run_time=0.3)
        self.play(FadeIn(why1), run_time=0.4)
        self.play(FadeIn(why2), run_time=0.4)
        self.play(FadeIn(why3), run_time=0.4)
        self.play(FadeIn(why4, scale=1.1), run_time=0.4)
        self.wait(9.5)

        # ─── EXAMPLE 1 (8s) ────────────────────────
        fadeall(self, dur=0.3)
        self.wait(0.2)

        ex_title = Text("EXAM QUESTION", font_size=28, color=SECONDARY, weight=BOLD)
        ex_title.move_to(UP * 7)

        # Fresh circle (smaller, higher)
        ex_oo = np.array([0, 2, 0])
        ex_r = 1.8
        ex_circ = chalk_circle(centre=ex_oo, radius=ex_r)

        ex_a = ex_oo + ex_r * np.array([np.cos(np.radians(40)), np.sin(np.radians(40)), 0])
        ex_b = ex_oo + ex_r * np.array([np.cos(np.radians(150)), np.sin(np.radians(150)), 0])
        ex_c = ex_oo + ex_r * np.array([np.cos(np.radians(210)), np.sin(np.radians(210)), 0])
        ex_d = ex_oo + ex_r * np.array([np.cos(np.radians(320)), np.sin(np.radians(320)), 0])

        ex_quad = Polygon(ex_a, ex_b, ex_c, ex_d, stroke_color=PRIMARY, stroke_width=3)

        ex_a_lbl = Text("A", font_size=18, color=SECONDARY).next_to(ex_a, UR, buff=0.08)
        ex_b_lbl = Text("B", font_size=18, color=SECONDARY).next_to(ex_b, UL, buff=0.08)
        ex_c_lbl = Text("C", font_size=18, color=SECONDARY).next_to(ex_c, DL, buff=0.08)
        ex_d_lbl = Text("D", font_size=18, color=SECONDARY).next_to(ex_d, DR, buff=0.08)

        ex_ang_a = angle_arc(ex_a, ex_d, ex_b, radius=0.35, stroke_color=ACCENT, stroke_width=3)
        ex_ang_a_lbl = Text("110\u00b0", font_size=20, color=ACCENT, weight=BOLD)
        ex_ang_a_lbl.move_to(angle_label_pos(ex_a, ex_d, ex_b, offset=0.65))

        ex_ang_c = angle_arc(ex_c, ex_b, ex_d, radius=0.35, stroke_color=HIGHLIGHT, stroke_width=3)
        ex_x_lbl = Text("x = ?", font_size=22, color=HIGHLIGHT, weight=BOLD)
        ex_x_lbl.move_to(angle_label_pos(ex_c, ex_b, ex_d, offset=0.65))

        sol1 = Text("x = 180\u00b0 - 110\u00b0", font_size=28, color=PRIMARY)
        sol2 = Text("x = 70\u00b0", font_size=34, color=HIGHLIGHT, weight=BOLD)
        sol = VGroup(sol1, sol2).arrange(DOWN, buff=0.3)
        sol.move_to(DOWN * 4.5)

        self.play(Write(ex_title), run_time=0.3)
        self.play(Create(ex_circ), run_time=0.4)
        self.play(Create(ex_quad), run_time=0.4)
        self.play(
            Write(ex_a_lbl), Write(ex_b_lbl), Write(ex_c_lbl), Write(ex_d_lbl),
            run_time=0.3,
        )
        self.play(Create(ex_ang_a), Write(ex_ang_a_lbl), run_time=0.3)
        self.play(Create(ex_ang_c), Write(ex_x_lbl), run_time=0.3)
        self.wait(4.0)
        self.play(FadeIn(sol1), run_time=0.3)
        self.wait(0.5)
        self.play(
            FadeIn(sol2, scale=1.2),
            ex_x_lbl.animate.become(
                Text("70\u00b0", font_size=22, color=HIGHLIGHT, weight=BOLD).move_to(ex_x_lbl.get_center())
            ),
            run_time=0.5,
        )
        self.wait(5.5)

        # ─── EXAMPLE 2 (7s) ────────────────────────
        fadeall(self, dur=0.3)
        self.wait(0.2)

        ex2_title = Text("ONE MORE", font_size=28, color=SECONDARY, weight=BOLD)
        ex2_title.move_to(UP * 7)

        ex2_circ = chalk_circle(centre=ex_oo, radius=ex_r)
        ex2_quad = Polygon(ex_a, ex_b, ex_c, ex_d, stroke_color=PRIMARY, stroke_width=3)

        ex2_a_lbl = Text("A", font_size=18, color=SECONDARY).next_to(ex_a, UR, buff=0.08)
        ex2_b_lbl = Text("B", font_size=18, color=SECONDARY).next_to(ex_b, UL, buff=0.08)
        ex2_c_lbl = Text("C", font_size=18, color=SECONDARY).next_to(ex_c, DL, buff=0.08)
        ex2_d_lbl = Text("D", font_size=18, color=SECONDARY).next_to(ex_d, DR, buff=0.08)

        ex2_ang_b = angle_arc(ex_b, ex_a, ex_c, radius=0.35, stroke_color=HIGHLIGHT, stroke_width=3)
        ex2_b_val = Text("65\u00b0", font_size=20, color=HIGHLIGHT, weight=BOLD)
        ex2_b_val.move_to(angle_label_pos(ex_b, ex_a, ex_c, offset=0.65))

        ex2_ang_d = angle_arc(ex_d, ex_c, ex_a, radius=0.35, stroke_color=ACCENT, stroke_width=3)
        ex2_y_lbl = Text("y = ?", font_size=22, color=ACCENT, weight=BOLD)
        ex2_y_lbl.move_to(angle_label_pos(ex_d, ex_c, ex_a, offset=0.65))

        sol2_1 = Text("y = 180\u00b0 - 65\u00b0", font_size=28, color=PRIMARY)
        sol2_2 = Text("y = 115\u00b0", font_size=34, color=ACCENT, weight=BOLD)
        sol2_grp = VGroup(sol2_1, sol2_2).arrange(DOWN, buff=0.3)
        sol2_grp.move_to(DOWN * 4.5)

        self.play(Write(ex2_title), run_time=0.3)
        self.play(Create(ex2_circ), run_time=0.4)
        self.play(Create(ex2_quad), run_time=0.4)
        self.play(
            Write(ex2_a_lbl), Write(ex2_b_lbl), Write(ex2_c_lbl), Write(ex2_d_lbl),
            run_time=0.3,
        )
        self.play(Create(ex2_ang_b), Write(ex2_b_val), run_time=0.3)
        self.play(Create(ex2_ang_d), Write(ex2_y_lbl), run_time=0.3)
        self.wait(3.5)
        self.play(FadeIn(sol2_1), run_time=0.3)
        self.wait(0.5)
        self.play(
            FadeIn(sol2_2, scale=1.2),
            ex2_y_lbl.animate.become(
                Text("115\u00b0", font_size=22, color=ACCENT, weight=BOLD).move_to(ex2_y_lbl.get_center())
            ),
            run_time=0.5,
        )
        self.wait(3.0)

        # ─── CTA (5s) ──────────────────────────────
        fadeall(self, dur=0.3)
        self.wait(0.2)

        cta1 = Text("FOLLOW", font_size=48, color=SECONDARY, weight=BOLD)
        cta2 = Text("for Theorem #5", font_size=32, color=PRIMARY)
        cta3 = Text("SAVE THIS SERIES.", font_size=30, color=ACCENT, weight=BOLD)
        cta = VGroup(cta1, cta2, cta3).arrange(DOWN, buff=0.5)

        self.play(FadeIn(cta, shift=UP * 0.3), run_time=0.5)
        self.wait(1.0)
        fadeall(self, dur=0.4)
