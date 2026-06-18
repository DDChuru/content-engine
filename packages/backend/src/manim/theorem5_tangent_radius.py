"""
Circle Theorem #5: Tangent-Radius Theorem
"A tangent is perpendicular to the radius at the point of contact"
Minimal Line Art style \u00b7 SA Matric / IGCSE \u00b7 TikTok 9:16

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
# MINIMAL LINE ART PALETTE
# ═══════════════════════════════════════════════════════════

BG         = "#fafafa"
PRIMARY    = "#1a1a2e"
SECONDARY  = "#e94560"
ACCENT     = "#0f3460"
TEXT_COLOR = "#1a1a2e"

# ═══════════════════════════════════════════════════════════
# GEOMETRY
# ═══════════════════════════════════════════════════════════

OO = np.array([0, 0.5, 0])   # circle centre
R  = 2.2                      # radius

P_ANG_INIT = -PI / 4          # initial tangent point (lower right)


# ═══════════════════════════════════════════════════════════
# HELPERS
# ═══════════════════════════════════════════════════════════

def pt(angle, centre=OO, radius=R):
    return centre + radius * np.array([np.cos(angle), np.sin(angle), 0])


def thin_line(start, end, color=PRIMARY, width=2):
    """Clean thin stroke for minimal style."""
    return Line(start, end, stroke_color=color, stroke_width=width)


def thin_circle(centre=OO, radius=R, color=PRIMARY, width=2):
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


def right_angle_marker(vertex, dir1, dir2, size=0.25, color=SECONDARY, width=2):
    """Draw a small square at vertex indicating a right angle.
    dir1 and dir2 are unit direction vectors from vertex along the two legs."""
    d1 = dir1 / np.linalg.norm(dir1)
    d2 = dir2 / np.linalg.norm(dir2)
    corner1 = vertex + d1 * size
    corner2 = vertex + d2 * size
    corner_mid = vertex + d1 * size + d2 * size
    sq = VGroup(
        Line(corner1, corner_mid, stroke_color=color, stroke_width=width),
        Line(corner2, corner_mid, stroke_color=color, stroke_width=width),
    )
    return sq


def tangent_line_at(angle, centre=OO, radius=R, length=5.0, color=ACCENT, width=2):
    """Create a tangent line at the given angle on the circle."""
    p = pt(angle, centre, radius)
    # Tangent direction is perpendicular to radius
    tang_dir = np.array([-np.sin(angle), np.cos(angle), 0])
    start = p - tang_dir * length / 2
    end = p + tang_dir * length / 2
    return Line(start, end, stroke_color=color, stroke_width=width)


def right_angle_at(angle, centre=OO, radius=R, size=0.25, color=SECONDARY, width=2):
    """Right angle marker at the tangent-radius contact point."""
    p = pt(angle, centre, radius)
    # Radius direction (outward)
    rad_dir = np.array([np.cos(angle), np.sin(angle), 0])
    # Tangent direction
    tang_dir = np.array([-np.sin(angle), np.cos(angle), 0])
    # The marker sits at p, going outward along radius and along tangent
    # We want the marker on the "outside" of the radius, so use -rad_dir
    return right_angle_marker(p, -rad_dir, tang_dir, size=size, color=color, width=width)


def fadeall(scene, dur=0.3):
    if scene.mobjects:
        scene.play(*[FadeOut(m) for m in scene.mobjects], run_time=dur)


# ═══════════════════════════════════════════════════════════
# THE THEOREM VIDEO
# ═══════════════════════════════════════════════════════════

class Theorem5_TangentRadius(Scene):
    def construct(self):
        self.camera.background_color = BG

        # ─── HOOK (7s) ───────────────────────────────
        t_num = Text("THEOREM #5", font_size=34, color=SECONDARY, weight=BOLD)
        t_line = Text("The foundation of", font_size=36, color=TEXT_COLOR)
        t_every = Text("EVERY tangent question.", font_size=40, color=ACCENT, weight=BOLD)
        hook = VGroup(t_num, t_line, t_every).arrange(DOWN, buff=0.4)

        self.play(FadeIn(hook, scale=1.1), run_time=0.6)
        self.wait(3.5)
        fadeall(self)

        # ─── THEOREM STATEMENT (8s) ──────────────────
        title = Text("TANGENT-RADIUS THEOREM", font_size=28, color=SECONDARY, weight=BOLD)
        title.move_to(UP * 7)

        rule_l = Text("Tangent", font_size=26, color=ACCENT)
        rule_perp = Text("\u22a5", font_size=34, color=SECONDARY, weight=BOLD)
        rule_r = Text("Radius at contact", font_size=26, color=PRIMARY)
        rule = VGroup(rule_l, rule_perp, rule_r).arrange(RIGHT, buff=0.15)
        rule.move_to(UP * 5.8)

        self.play(Write(title), run_time=0.4)
        self.play(FadeIn(rule), run_time=0.4)
        self.wait(5.5)

        # ─── SETUP (10s) ────────────────────────────
        circ = thin_circle()

        o_dot = Dot(OO, radius=0.06, color=PRIMARY)
        o_lbl = Text("O", font_size=20, color=PRIMARY).next_to(o_dot, UP, buff=0.12)

        P = pt(P_ANG_INIT)
        p_dot = Dot(P, radius=0.06, color=SECONDARY)
        p_lbl = Text("P", font_size=20, color=SECONDARY).next_to(p_dot, DR, buff=0.1)

        # Radius OP
        radius_line = thin_line(OO, P, color=PRIMARY)

        self.play(Create(circ), run_time=0.7)
        self.play(
            FadeIn(o_dot), Write(o_lbl),
            run_time=0.4,
        )
        self.play(
            FadeIn(p_dot), Write(p_lbl),
            Create(radius_line),
            run_time=0.5,
        )
        self.wait(4.0)

        # Tangent line at P
        tang = tangent_line_at(P_ANG_INIT)
        tang_label = Text("tangent", font_size=18, color=ACCENT)
        tang_end = P + np.array([-np.sin(P_ANG_INIT), np.cos(P_ANG_INIT), 0]) * 2.5
        tang_label.next_to(tang_end, UP, buff=0.1)

        self.play(Create(tang), run_time=0.6)
        self.play(Write(tang_label), run_time=0.3)
        self.wait(5.0)

        # Right angle marker
        ra_marker = right_angle_at(P_ANG_INIT)
        ra_label = Text("90\u00b0", font_size=22, color=SECONDARY, weight=BOLD)
        # Position the label near the right angle
        rad_dir = np.array([np.cos(P_ANG_INIT), np.sin(P_ANG_INIT), 0])
        tang_dir = np.array([-np.sin(P_ANG_INIT), np.cos(P_ANG_INIT), 0])
        ra_label.move_to(P + (-rad_dir + tang_dir) * 0.5)

        self.play(Create(ra_marker), Write(ra_label), run_time=0.5)
        self.wait(4.0)

        # ─── ROTATE TANGENT POINT (8s) ──────────────
        # Remove static P elements, build dynamic
        self.play(
            FadeOut(p_dot), FadeOut(p_lbl),
            FadeOut(radius_line), FadeOut(tang),
            FadeOut(tang_label), FadeOut(ra_marker), FadeOut(ra_label),
            run_time=0.3,
        )

        rotate_text = Text("At every position: 90\u00b0", font_size=22, color=TEXT_COLOR)
        rotate_text.move_to(UP * 4.8)
        self.play(FadeIn(rotate_text), run_time=0.4)

        p_tracker = ValueTracker(P_ANG_INIT)

        def get_p():
            return pt(p_tracker.get_value())

        dyn_p_dot = always_redraw(lambda: Dot(get_p(), radius=0.07, color=SECONDARY))
        dyn_radius = always_redraw(lambda: thin_line(OO, get_p(), color=PRIMARY))
        dyn_tang = always_redraw(lambda: tangent_line_at(p_tracker.get_value()))
        dyn_ra = always_redraw(lambda: right_angle_at(p_tracker.get_value()))
        dyn_p_lbl = always_redraw(lambda:
            Text("P", font_size=18, color=SECONDARY).move_to(
                get_p() + np.array([np.cos(p_tracker.get_value()),
                                    np.sin(p_tracker.get_value()), 0]) * 0.3
            )
        )

        self.add(dyn_p_dot, dyn_radius, dyn_tang, dyn_ra, dyn_p_lbl)

        # Sweep P around the circle
        self.play(p_tracker.animate.set_value(PI / 3), run_time=2.2, rate_func=smooth)
        self.play(p_tracker.animate.set_value(PI), run_time=2.2, rate_func=smooth)
        self.play(p_tracker.animate.set_value(-PI / 2), run_time=2.2, rate_func=smooth)

        self.wait(3.5)

        # ─── WHY (7s) ──────────────────────────────
        fadeall(self, dur=0.3)
        self.wait(0.2)

        why_title = Text("WHY?", font_size=32, color=SECONDARY, weight=BOLD)
        why_title.move_to(UP * 6.5)

        why1 = Text("If angle is not 90\u00b0...", font_size=22, color=TEXT_COLOR)
        why2 = Text("line enters the circle", font_size=22, color=SECONDARY, weight=BOLD)
        why_arrow = Text("\u2192 secant, NOT tangent", font_size=22, color=TEXT_COLOR)
        why3 = Text("90\u00b0 is the ONLY angle", font_size=22, color=TEXT_COLOR)
        why4 = Text("that keeps one contact point.", font_size=24, color=ACCENT, weight=BOLD)
        why_grp = VGroup(why1, why2, why_arrow, why3, why4).arrange(DOWN, buff=0.3)
        why_grp.move_to(ORIGIN)

        self.play(Write(why_title), run_time=0.3)
        self.play(FadeIn(why1), run_time=0.4)
        self.play(FadeIn(why2), run_time=0.4)
        self.play(FadeIn(why_arrow), run_time=0.3)
        self.play(FadeIn(why3), run_time=0.3)
        self.play(FadeIn(why4, scale=1.05), run_time=0.4)
        self.wait(9.0)

        # ─── EXAMPLE 1 (9s) ────────────────────────
        fadeall(self, dur=0.3)
        self.wait(0.2)

        ex_title = Text("EXAM QUESTION", font_size=28, color=SECONDARY, weight=BOLD)
        ex_title.move_to(UP * 7)

        # Right triangle: O at top-left, T at bottom, A at right
        # OT = 5 (radius), TA = 12 (tangent), OA = 13 (hypotenuse)
        # Scale to fit nicely
        scale_f = 0.22
        tri_o = np.array([-2.0, 3.0, 0])
        tri_t = np.array([-2.0, 3.0 - 5 * scale_f, 0])   # straight down from O
        tri_a = np.array([-2.0 + 12 * scale_f, 3.0 - 5 * scale_f, 0])  # right of T

        # Small circle at O to indicate it is a centre
        mini_r = 5 * scale_f
        mini_circ = thin_circle(centre=tri_o, radius=mini_r, color=PRIMARY, width=1.5)

        # Lines of the triangle
        ot_line = thin_line(tri_o, tri_t, color=PRIMARY)
        ta_line = thin_line(tri_t, tri_a, color=ACCENT)
        oa_line = thin_line(tri_o, tri_a, color=SECONDARY)

        # Labels
        o_ex_lbl = Text("O", font_size=18, color=PRIMARY).next_to(tri_o, UL, buff=0.08)
        t_ex_lbl = Text("T", font_size=18, color=PRIMARY).next_to(tri_t, DL, buff=0.08)
        a_ex_lbl = Text("A", font_size=18, color=PRIMARY).next_to(tri_a, DR, buff=0.08)

        # Side labels
        ot_val = Text("5", font_size=20, color=PRIMARY, weight=BOLD)
        ot_val.next_to(ot_line, LEFT, buff=0.15)
        ta_val = Text("12", font_size=20, color=ACCENT, weight=BOLD)
        ta_val.next_to(ta_line, DOWN, buff=0.15)
        oa_val = Text("OA = ?", font_size=20, color=SECONDARY, weight=BOLD)
        oa_val.next_to(oa_line, UR, buff=0.1)

        # Right angle at T
        dir_to = (tri_o - tri_t)[:3]
        dir_ta = (tri_a - tri_t)[:3]
        ra_ex = right_angle_marker(tri_t, dir_to, dir_ta, size=0.2, color=SECONDARY)

        # Solution
        sol_l1 = Text("OA\u00b2 = 5\u00b2 + 12\u00b2", font_size=26, color=TEXT_COLOR)
        sol_l2 = Text("OA\u00b2 = 25 + 144 = 169", font_size=26, color=TEXT_COLOR)
        sol_l3 = Text("OA = 13", font_size=32, color=SECONDARY, weight=BOLD)
        sol_grp = VGroup(sol_l1, sol_l2, sol_l3).arrange(DOWN, buff=0.25)
        sol_grp.move_to(DOWN * 4)

        self.play(Write(ex_title), run_time=0.3)
        self.play(Create(mini_circ), run_time=0.3)
        self.play(
            Create(ot_line), Create(ta_line), Create(oa_line),
            run_time=0.5,
        )
        self.play(
            Write(o_ex_lbl), Write(t_ex_lbl), Write(a_ex_lbl),
            Write(ot_val), Write(ta_val), Write(oa_val),
            Create(ra_ex),
            run_time=0.5,
        )
        self.wait(4.0)
        self.play(FadeIn(sol_l1), run_time=0.4)
        self.wait(0.5)
        self.play(FadeIn(sol_l2), run_time=0.4)
        self.wait(0.5)
        self.play(
            FadeIn(sol_l3, scale=1.2),
            oa_val.animate.become(
                Text("OA = 13", font_size=20, color=SECONDARY, weight=BOLD).move_to(oa_val.get_center())
            ),
            run_time=0.5,
        )
        self.wait(3.5)

        # ─── EXAMPLE 2 (8s) ────────────────────────
        fadeall(self, dur=0.3)
        self.wait(0.2)

        ex2_title = Text("ONE MORE", font_size=28, color=SECONDARY, weight=BOLD)
        ex2_title.move_to(UP * 7)

        # OA = 10, OT = 6, find TA
        scale_f2 = 0.22
        tri2_o = np.array([-2.0, 3.0, 0])
        tri2_t = np.array([-2.0, 3.0 - 6 * scale_f2, 0])
        tri2_a = np.array([-2.0 + 8 * scale_f2, 3.0 - 6 * scale_f2, 0])

        mini_r2 = 6 * scale_f2
        mini_circ2 = thin_circle(centre=tri2_o, radius=mini_r2, color=PRIMARY, width=1.5)

        ot2_line = thin_line(tri2_o, tri2_t, color=PRIMARY)
        ta2_line = thin_line(tri2_t, tri2_a, color=ACCENT)
        oa2_line = thin_line(tri2_o, tri2_a, color=SECONDARY)

        o2_lbl = Text("O", font_size=18, color=PRIMARY).next_to(tri2_o, UL, buff=0.08)
        t2_lbl = Text("T", font_size=18, color=PRIMARY).next_to(tri2_t, DL, buff=0.08)
        a2_lbl = Text("A", font_size=18, color=PRIMARY).next_to(tri2_a, DR, buff=0.08)

        ot2_val = Text("6", font_size=20, color=PRIMARY, weight=BOLD)
        ot2_val.next_to(ot2_line, LEFT, buff=0.15)
        oa2_val = Text("10", font_size=20, color=SECONDARY, weight=BOLD)
        oa2_val.next_to(oa2_line, UR, buff=0.1)
        ta2_val = Text("TA = ?", font_size=20, color=ACCENT, weight=BOLD)
        ta2_val.next_to(ta2_line, DOWN, buff=0.15)

        dir_to2 = (tri2_o - tri2_t)[:3]
        dir_ta2 = (tri2_a - tri2_t)[:3]
        ra_ex2 = right_angle_marker(tri2_t, dir_to2, dir_ta2, size=0.2, color=SECONDARY)

        sol2_l1 = Text("TA\u00b2 = 10\u00b2 - 6\u00b2", font_size=26, color=TEXT_COLOR)
        sol2_l2 = Text("TA\u00b2 = 100 - 36 = 64", font_size=26, color=TEXT_COLOR)
        sol2_l3 = Text("TA = 8", font_size=32, color=ACCENT, weight=BOLD)
        sol2_grp = VGroup(sol2_l1, sol2_l2, sol2_l3).arrange(DOWN, buff=0.25)
        sol2_grp.move_to(DOWN * 4)

        self.play(Write(ex2_title), run_time=0.3)
        self.play(Create(mini_circ2), run_time=0.3)
        self.play(
            Create(ot2_line), Create(ta2_line), Create(oa2_line),
            run_time=0.5,
        )
        self.play(
            Write(o2_lbl), Write(t2_lbl), Write(a2_lbl),
            Write(ot2_val), Write(oa2_val), Write(ta2_val),
            Create(ra_ex2),
            run_time=0.5,
        )
        self.wait(1.5)
        self.play(FadeIn(sol2_l1), run_time=0.4)
        self.wait(0.5)
        self.play(FadeIn(sol2_l2), run_time=0.4)
        self.wait(0.5)
        self.play(
            FadeIn(sol2_l3, scale=1.2),
            ta2_val.animate.become(
                Text("TA = 8", font_size=20, color=ACCENT, weight=BOLD).move_to(ta2_val.get_center())
            ),
            run_time=0.5,
        )
        self.wait(4.0)

        # ─── CTA (5s) ──────────────────────────────
        fadeall(self, dur=0.3)
        self.wait(0.2)

        cta1 = Text("FOLLOW", font_size=48, color=SECONDARY, weight=BOLD)
        cta2 = Text("for Theorem #6", font_size=32, color=TEXT_COLOR)
        cta3 = Text("SAVE THIS SERIES.", font_size=30, color=ACCENT, weight=BOLD)
        cta = VGroup(cta1, cta2, cta3).arrange(DOWN, buff=0.5)

        self.play(FadeIn(cta, shift=UP * 0.3), run_time=0.5)
        self.wait(2.0)
        fadeall(self, dur=0.4)
