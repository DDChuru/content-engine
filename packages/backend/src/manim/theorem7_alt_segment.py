"""
Circle Theorem #7: Alternate Segment Theorem (Tangent-Chord)
"The angle between a tangent and a chord equals the inscribed angle
 in the alternate segment"
Glassmorphism style · SA Matric / IGCSE · TikTok 9:16

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
# GLASSMORPHISM PALETTE
# ═══════════════════════════════════════════════════════════

BG        = "#1a1a2e"
PRIMARY   = "#a8edea"   # mint/teal
SECONDARY = "#fed6e3"   # soft pink
ACCENT    = "#c3cfe2"   # light blue-grey
HIGHLIGHT = "#f5f7fa"   # near white

# ═══════════════════════════════════════════════════════════
# GEOMETRY
# ═══════════════════════════════════════════════════════════

OO = np.array([0, 0.5, 0])    # circle centre
R  = 2.2                       # radius

# Point A at the bottom of the circle
A_ANG = -PI / 2

# Point B in upper-right area: chord AB goes from bottom to upper-right
B_ANG = PI / 5   # 36 degrees — upper right

# Point C in the alternate segment (upper-left arc, the arc NOT containing
# the tangent side). The alternate segment is the arc on the opposite side
# of chord AB from the tangent direction.
C_ANG = 3 * PI / 4   # 135 degrees — upper left


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
    c = Circle(radius=R, stroke_color=PRIMARY, stroke_width=2)
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


def glass_panel(width, height, centre=ORIGIN, stroke_color=PRIMARY):
    """Create a frosted-glass panel (glassmorphism effect)."""
    return RoundedRectangle(
        width=width, height=height, corner_radius=0.25,
        fill_color=BG, fill_opacity=0.15,
        stroke_color=stroke_color, stroke_width=1,
    ).move_to(centre)


def glass_info_box(width, height, centre=ORIGIN, stroke_color=PRIMARY):
    """Create a more opaque glass panel for info text."""
    return RoundedRectangle(
        width=width, height=height, corner_radius=0.2,
        fill_color=BG, fill_opacity=0.85,
        stroke_color=stroke_color, stroke_width=1,
    ).move_to(centre)


# ═══════════════════════════════════════════════════════════
# THE THEOREM VIDEO
# ═══════════════════════════════════════════════════════════

class Theorem7_AltSegment(Scene):
    def construct(self):
        self.camera.background_color = BG

        A = pt(A_ANG)
        B = pt(B_ANG)
        C = pt(C_ANG)

        # Tangent at A is horizontal (perpendicular to vertical radius OA)
        # Tangent direction is to the right: (1, 0, 0)
        tangent_left  = A + np.array([-3.5, 0, 0])
        tangent_right = A + np.array([3.5, 0, 0])

        # The tangent-chord angle alpha:
        # Angle between tangent (rightward from A) and chord AB at vertex A
        # We compute alpha as the angle the chord AB makes with the horizontal
        _ab_dir = B - A
        _alpha_rad = float(np.arctan2(_ab_dir[1], _ab_dir[0]))
        _alpha_deg = np.degrees(_alpha_rad)

        # The inscribed angle ACB in the alternate segment
        # By the theorem, angle ACB = alpha
        # We round for display
        alpha_display = int(round(_alpha_deg))

        # ─── HOOK (7s) ─────────────────────────────────
        hook_panel = glass_panel(7.5, 4.5, ORIGIN, SECONDARY)

        t_num = Text("THEOREM #7", font_size=34, color=SECONDARY, weight=BOLD)
        t_line = Text("The HARDEST theorem.", font_size=34, color=HIGHLIGHT)
        t_half = Text("Master this, you've won.", font_size=38, color=PRIMARY, weight=BOLD)
        hook = VGroup(t_num, t_line, t_half).arrange(DOWN, buff=0.4)

        self.play(FadeIn(hook_panel), run_time=0.3)
        self.play(FadeIn(hook, scale=1.1), run_time=0.5)
        self.wait(6.3)
        fadeall(self)

        # ─── THEOREM STATEMENT (8s) ────────────────────
        title = Text("ALTERNATE SEGMENT", font_size=28, color=SECONDARY, weight=BOLD)
        title2 = Text("THEOREM", font_size=28, color=SECONDARY, weight=BOLD)
        title_grp = VGroup(title, title2).arrange(DOWN, buff=0.1)
        title_grp.move_to(UP * 7)

        stmt_panel = glass_panel(8.0, 2.0, UP * 5.5, ACCENT)
        rule1 = Text("Tangent-chord angle", font_size=22, color=SECONDARY)
        rule_eq = Text("=", font_size=28, color=HIGHLIGHT, weight=BOLD)
        rule2 = Text("Inscribed angle in", font_size=22, color=PRIMARY)
        rule_row = VGroup(rule1, rule_eq, rule2).arrange(RIGHT, buff=0.12)
        rule3 = Text("alternate segment", font_size=22, color=PRIMARY)
        rule_full = VGroup(rule_row, rule3).arrange(DOWN, buff=0.15)
        rule_full.move_to(stmt_panel.get_center())

        self.play(Write(title_grp), run_time=0.4)
        self.play(FadeIn(stmt_panel), FadeIn(rule_full), run_time=0.4)
        self.wait(6.5)

        # ─── SETUP (10s) ──────────────────────────────
        cg = neon_circle()

        # Tangent line at A (horizontal)
        tangent = Line(tangent_left, tangent_right, stroke_color=SECONDARY, stroke_width=2.5)
        tangent_g = neon(tangent, layers=2, extra=5)

        # Chord AB
        chord_ab = Line(A, B, stroke_color=PRIMARY, stroke_width=2.5)
        chord_g = neon(chord_ab, layers=2, extra=5)

        # Dots and labels
        a_dot = Dot(A, radius=0.08, color=SECONDARY)
        b_dot = Dot(B, radius=0.07, color=PRIMARY)
        a_lbl = Text("A", font_size=22, color=SECONDARY, weight=BOLD).next_to(a_dot, DL, buff=0.12)
        b_lbl = Text("B", font_size=22, color=PRIMARY, weight=BOLD).next_to(b_dot, UR, buff=0.12)

        # Tangent-chord angle alpha at A
        # Angle between tangent (rightward) direction and chord AB
        tangent_right_pt = A + np.array([2.0, 0, 0])
        ang_alpha = angle_arc(A, tangent_right_pt, B, radius=0.6,
                              stroke_color=SECONDARY, stroke_width=3)
        alpha_str = str(alpha_display) + "\u00b0"
        ang_alpha_lbl = Text(alpha_str, font_size=22, color=SECONDARY, weight=BOLD)
        ang_alpha_lbl.move_to(angle_label_pos(A, tangent_right_pt, B, offset=0.95))

        # Label for tangent
        tan_label = Text("tangent", font_size=16, color=ACCENT)
        tan_label.next_to(tangent_right, UP, buff=0.1)

        self.play(Create(cg), run_time=0.5)
        self.play(Create(tangent_g), run_time=0.4)
        self.play(Write(tan_label), run_time=0.2)
        self.play(
            FadeIn(a_dot), Write(a_lbl),
            FadeIn(b_dot), Write(b_lbl),
            run_time=0.4,
        )
        self.play(Create(chord_g), run_time=0.4)
        self.play(Create(ang_alpha), Write(ang_alpha_lbl), run_time=0.4)
        self.wait(6.5)

        # ─── ALTERNATE SEGMENT (9s) ───────────────────
        # Point C in the alternate segment
        c_dot = Dot(C, radius=0.07, color=HIGHLIGHT)
        c_lbl = Text("C", font_size=22, color=HIGHLIGHT, weight=BOLD).next_to(c_dot, UL, buff=0.12)

        # Chords CA and CB
        ca_line = Line(C, A, stroke_color=ACCENT, stroke_width=2)
        cb_line = Line(C, B, stroke_color=ACCENT, stroke_width=2)
        ca_g = neon(ca_line, layers=2, extra=5)
        cb_g = neon(cb_line, layers=2, extra=5)

        # Angle ACB at C
        ang_acb = angle_arc(C, A, B, radius=0.45, stroke_color=PRIMARY, stroke_width=3)
        ang_acb_lbl = Text(alpha_str, font_size=22, color=PRIMARY, weight=BOLD)
        ang_acb_lbl.move_to(angle_label_pos(C, A, B, offset=0.85))

        # Highlight the alternate segment arc (the arc from A to B going
        # through C, i.e. the major arc going counter-clockwise from A up to B
        # passing through C)
        # Arc from A_ANG through C_ANG to B_ANG (going counter-clockwise)
        alt_arc_angle = (B_ANG - A_ANG + TAU) % TAU
        alt_seg_arc = Arc(
            radius=R, start_angle=A_ANG, angle=alt_arc_angle,
            arc_center=OO, stroke_color=SECONDARY, stroke_width=3,
            stroke_opacity=0.4,
        )

        self.play(FadeIn(alt_seg_arc), run_time=0.3)
        self.play(FadeIn(c_dot), Write(c_lbl), run_time=0.3)
        self.play(Create(ca_g), Create(cb_g), run_time=0.5)
        self.play(Create(ang_acb), Write(ang_acb_lbl), run_time=0.4)

        # Flash equality
        eq_text = Text(
            alpha_str + " = " + alpha_str,
            font_size=32, color=HIGHLIGHT, weight=BOLD,
        )
        eq_text.move_to(DOWN * 5.0)
        eq_panel = glass_info_box(5.0, 1.2, eq_text.get_center(), PRIMARY)

        self.play(FadeIn(eq_panel), FadeIn(eq_text, scale=1.2), run_time=0.4)
        self.wait(6.5)

        # ─── MOVE C ALONG ARC (7s) ───────────────────
        self.play(
            FadeOut(c_dot), FadeOut(c_lbl),
            FadeOut(ca_g), FadeOut(cb_g),
            FadeOut(ang_acb), FadeOut(ang_acb_lbl),
            FadeOut(eq_panel), FadeOut(eq_text),
            run_time=0.3,
        )

        c_tracker = ValueTracker(C_ANG)

        def get_c():
            return pt(c_tracker.get_value())

        dyn_c_dot = always_redraw(lambda: Dot(get_c(), radius=0.08, color=HIGHLIGHT))
        dyn_ca = always_redraw(lambda: Line(get_c(), A, stroke_color=ACCENT, stroke_width=2))
        dyn_cb = always_redraw(lambda: Line(get_c(), B, stroke_color=ACCENT, stroke_width=2))
        dyn_ang = always_redraw(lambda: angle_arc(
            get_c(), A, B, radius=0.45, stroke_color=PRIMARY, stroke_width=3
        ))
        dyn_lbl = always_redraw(lambda:
            Text(alpha_str, font_size=24, color=PRIMARY, weight=BOLD).move_to(
                angle_label_pos(get_c(), A, B, offset=0.85)
            )
        )

        self.add(dyn_c_dot, dyn_ca, dyn_cb, dyn_ang, dyn_lbl)

        # Sweep C along the alternate segment arc
        # C starts at 3PI/4, move to ~PI (left), then ~PI/2 (top), back to 3PI/4
        self.play(c_tracker.animate.set_value(PI * 0.9), run_time=1.5, rate_func=smooth)
        self.play(c_tracker.animate.set_value(PI / 2), run_time=2.0, rate_func=smooth)
        self.play(c_tracker.animate.set_value(3 * PI / 4), run_time=1.5, rate_func=smooth)

        # "Always equal" label
        always_lbl = Text("Always equal!", font_size=26, color=PRIMARY, weight=BOLD)
        always_lbl.move_to(DOWN * 5.0)
        always_panel = glass_info_box(4.5, 1.0, always_lbl.get_center(), PRIMARY)
        self.play(FadeIn(always_panel), FadeIn(always_lbl), run_time=0.3)
        self.wait(2.5)

        # ─── WHY (7s) ─────────────────────────────────
        fadeall(self, dur=0.3)
        self.wait(0.2)

        why_panel = glass_info_box(7.5, 3.5, ORIGIN, ACCENT)

        why1 = Text("Tangent-radius = 90\u00b0", font_size=24, color=SECONDARY)
        why2 = Text("Tangent-chord angle = half the arc", font_size=22, color=HIGHLIGHT)
        why3 = Text("Inscribed angle = half the same arc", font_size=22, color=HIGHLIGHT)
        why4 = Text("Therefore they are EQUAL", font_size=26, color=PRIMARY, weight=BOLD)
        why_grp = VGroup(why1, why2, why3, why4).arrange(DOWN, buff=0.3)
        why_grp.move_to(why_panel.get_center())

        self.play(FadeIn(why_panel), run_time=0.2)
        self.play(FadeIn(why_grp), run_time=0.5)
        self.wait(6.0)

        # ─── EXAMPLE 1 (8s) ──────────────────────────
        fadeall(self, dur=0.3)
        self.wait(0.2)

        ex_title = Text("EXAM QUESTION", font_size=28, color=SECONDARY, weight=BOLD)
        ex_title.move_to(UP * 7)

        # Smaller circle for examples
        ex_oo = np.array([0, 2.0, 0])
        ex_r = 1.6

        def ex_pt(angle):
            return ex_oo + ex_r * np.array([np.cos(angle), np.sin(angle), 0])

        ex_circle = Circle(radius=ex_r, stroke_color=PRIMARY, stroke_width=2).move_to(ex_oo)
        ex_cg = neon(ex_circle, layers=2, extra=6)

        # Point A at bottom, tangent horizontal
        ex_a = ex_pt(-PI / 2)
        ex_b = ex_pt(PI / 4)    # upper right
        ex_c = ex_pt(5 * PI / 6)  # upper left (alternate segment)

        ex_tangent_l = ex_a + np.array([-2.5, 0, 0])
        ex_tangent_r = ex_a + np.array([2.5, 0, 0])
        ex_tangent = Line(ex_tangent_l, ex_tangent_r, stroke_color=SECONDARY, stroke_width=2)

        ex_chord = Line(ex_a, ex_b, stroke_color=PRIMARY, stroke_width=2)
        ex_ca = Line(ex_c, ex_a, stroke_color=ACCENT, stroke_width=2)
        ex_cb = Line(ex_c, ex_b, stroke_color=ACCENT, stroke_width=2)

        ex_a_dot = Dot(ex_a, radius=0.06, color=SECONDARY)
        ex_b_dot = Dot(ex_b, radius=0.06, color=PRIMARY)
        ex_c_dot = Dot(ex_c, radius=0.06, color=HIGHLIGHT)
        ex_a_lbl = Text("A", font_size=18, color=SECONDARY).next_to(ex_a_dot, DL, buff=0.1)
        ex_b_lbl = Text("B", font_size=18, color=PRIMARY).next_to(ex_b_dot, UR, buff=0.1)
        ex_c_lbl = Text("C", font_size=18, color=HIGHLIGHT).next_to(ex_c_dot, UL, buff=0.1)

        # Tangent-chord angle = 40 degrees (given)
        ex_tan_right = ex_a + np.array([1.5, 0, 0])
        ex_ang_tc = angle_arc(ex_a, ex_tan_right, ex_b, radius=0.45,
                              stroke_color=SECONDARY, stroke_width=3)
        ex_tc_lbl = Text("40\u00b0", font_size=20, color=SECONDARY, weight=BOLD)
        ex_tc_lbl.move_to(angle_label_pos(ex_a, ex_tan_right, ex_b, offset=0.8))

        # Inscribed angle ACB = ?
        ex_ang_acb = angle_arc(ex_c, ex_a, ex_b, radius=0.35,
                               stroke_color=PRIMARY, stroke_width=3)
        ex_acb_lbl = Text("?", font_size=22, color=PRIMARY, weight=BOLD)
        ex_acb_lbl.move_to(angle_label_pos(ex_c, ex_a, ex_b, offset=0.7))

        self.play(Write(ex_title), run_time=0.3)
        self.play(Create(ex_cg), run_time=0.4)
        self.play(Create(ex_tangent), run_time=0.3)
        self.play(
            FadeIn(ex_a_dot), Write(ex_a_lbl),
            FadeIn(ex_b_dot), Write(ex_b_lbl),
            FadeIn(ex_c_dot), Write(ex_c_lbl),
            run_time=0.4,
        )
        self.play(Create(ex_chord), Create(ex_ca), Create(ex_cb), run_time=0.4)
        self.play(
            Create(ex_ang_tc), Write(ex_tc_lbl),
            Create(ex_ang_acb), Write(ex_acb_lbl),
            run_time=0.4,
        )
        self.wait(2.5)

        # Solution
        sol1 = Text("Alternate segment theorem", font_size=22, color=HIGHLIGHT)
        sol2 = Text("\u2220ACB = 40\u00b0", font_size=34, color=PRIMARY, weight=BOLD)
        sol_grp = VGroup(sol1, sol2).arrange(DOWN, buff=0.3)
        sol_grp.move_to(DOWN * 4.5)
        sol_panel = glass_info_box(5.5, 1.8, sol_grp.get_center(), PRIMARY)

        self.play(FadeIn(sol_panel), FadeIn(sol1), run_time=0.3)
        self.wait(0.3)
        self.play(
            FadeIn(sol2, scale=1.2),
            ex_acb_lbl.animate.become(
                Text("40\u00b0", font_size=20, color=PRIMARY, weight=BOLD).move_to(ex_acb_lbl.get_center())
            ),
            run_time=0.5,
        )
        self.wait(3.0)

        # ─── EXAMPLE 2 (7s) ──────────────────────────
        fadeall(self, dur=0.3)
        self.wait(0.2)

        ex2_title = Text("REVERSE IT", font_size=28, color=SECONDARY, weight=BOLD)
        ex2_title.move_to(UP * 7)

        # Same geometry, different given/find
        ex2_circle = Circle(radius=ex_r, stroke_color=PRIMARY, stroke_width=2).move_to(ex_oo)
        ex2_cg = neon(ex2_circle, layers=2, extra=6)

        ex2_tangent = Line(ex_tangent_l, ex_tangent_r, stroke_color=SECONDARY, stroke_width=2)
        ex2_chord = Line(ex_a, ex_b, stroke_color=PRIMARY, stroke_width=2)
        ex2_ca = Line(ex_c, ex_a, stroke_color=ACCENT, stroke_width=2)
        ex2_cb = Line(ex_c, ex_b, stroke_color=ACCENT, stroke_width=2)

        ex2_a_dot = Dot(ex_a, radius=0.06, color=SECONDARY)
        ex2_b_dot = Dot(ex_b, radius=0.06, color=PRIMARY)
        ex2_c_dot = Dot(ex_c, radius=0.06, color=HIGHLIGHT)
        ex2_a_lbl = Text("A", font_size=18, color=SECONDARY).next_to(ex_a_dot, DL, buff=0.1)
        ex2_b_lbl = Text("B", font_size=18, color=PRIMARY).next_to(ex_b_dot, UR, buff=0.1)
        ex2_c_lbl = Text("C", font_size=18, color=HIGHLIGHT).next_to(ex_c_dot, UL, buff=0.1)

        # Inscribed angle ACB = 55 degrees (given)
        ex2_ang_acb = angle_arc(ex_c, ex_a, ex_b, radius=0.35,
                                stroke_color=PRIMARY, stroke_width=3)
        ex2_acb_lbl = Text("55\u00b0", font_size=20, color=PRIMARY, weight=BOLD)
        ex2_acb_lbl.move_to(angle_label_pos(ex_c, ex_a, ex_b, offset=0.7))

        # Tangent-chord angle = ?
        ex2_ang_tc = angle_arc(ex_a, ex_tan_right, ex_b, radius=0.45,
                               stroke_color=SECONDARY, stroke_width=3)
        ex2_tc_lbl = Text("?", font_size=22, color=SECONDARY, weight=BOLD)
        ex2_tc_lbl.move_to(angle_label_pos(ex_a, ex_tan_right, ex_b, offset=0.8))

        self.play(Write(ex2_title), run_time=0.3)
        self.play(Create(ex2_cg), run_time=0.4)
        self.play(Create(ex2_tangent), run_time=0.3)
        self.play(
            FadeIn(ex2_a_dot), Write(ex2_a_lbl),
            FadeIn(ex2_b_dot), Write(ex2_b_lbl),
            FadeIn(ex2_c_dot), Write(ex2_c_lbl),
            run_time=0.4,
        )
        self.play(Create(ex2_chord), Create(ex2_ca), Create(ex2_cb), run_time=0.4)
        self.play(
            Create(ex2_ang_acb), Write(ex2_acb_lbl),
            Create(ex2_ang_tc), Write(ex2_tc_lbl),
            run_time=0.4,
        )
        self.wait(1.0)

        # Solution
        sol2_1 = Text("Alternate segment theorem", font_size=22, color=HIGHLIGHT)
        sol2_2 = Text("Tangent-chord = 55\u00b0", font_size=34, color=SECONDARY, weight=BOLD)
        sol2_grp = VGroup(sol2_1, sol2_2).arrange(DOWN, buff=0.3)
        sol2_grp.move_to(DOWN * 4.5)
        sol2_panel = glass_info_box(5.5, 1.8, sol2_grp.get_center(), SECONDARY)

        self.play(FadeIn(sol2_panel), FadeIn(sol2_1), run_time=0.3)
        self.wait(0.3)
        self.play(
            FadeIn(sol2_2, scale=1.2),
            ex2_tc_lbl.animate.become(
                Text("55\u00b0", font_size=20, color=SECONDARY, weight=BOLD).move_to(ex2_tc_lbl.get_center())
            ),
            run_time=0.5,
        )

        # Finale text
        fin = Text("ALL SEVEN. Go ace that exam.", font_size=24, color=PRIMARY, weight=BOLD)
        fin.move_to(DOWN * 6.5)
        self.play(FadeIn(fin), run_time=0.3)
        self.wait(3.0)

        # ─── CTA (5s) ──────────────────────────────────
        fadeall(self, dur=0.3)
        self.wait(0.2)

        cta_panel = glass_panel(7.5, 5.0, ORIGIN, SECONDARY)
        cta1 = Text("ALL 7 THEOREMS", font_size=42, color=PRIMARY, weight=BOLD)
        cta2 = Text("COMPLETE", font_size=48, color=SECONDARY, weight=BOLD)
        cta3 = Text("Save this series.", font_size=28, color=HIGHLIGHT)
        cta = VGroup(cta1, cta2, cta3).arrange(DOWN, buff=0.5)

        self.play(FadeIn(cta_panel), run_time=0.2)
        self.play(FadeIn(cta, shift=UP * 0.3), run_time=0.5)
        self.wait(4.5)
        fadeall(self, dur=0.4)
