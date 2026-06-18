"""
Circle Geometry Basics — 8 Visual Styles (v2 — synced to narration)
"Before you master circle geometry, know these 8 terms"
SA Matric · Cambridge IGCSE Extended (E4.1 → E4.7)
TikTok 9:16 · 1080×1920 · 30fps

Narration: 85s total. Each scene timed to match its narration segment.
"""

from manim import *
import numpy as np

# ═══════════════════════════════════════════════════════════
# PORTRAIT 9:16 CONFIG
# ═══════════════════════════════════════════════════════════

config.pixel_width = 1080
config.pixel_height = 1920
config.frame_width = 9
config.frame_height = 16
config.frame_rate = 30

# ═══════════════════════════════════════════════════════════
# STYLE PALETTES
# ═══════════════════════════════════════════════════════════

NEON_BG      = "#0a0a1a"
NEON_CYAN    = "#00ffff"
NEON_MAGENTA = "#ff00ff"
NEON_PINK    = "#ff6ec7"

BP_BG     = "#0d2137"
BP_LINE   = "#4a90d9"
BP_ACCENT = "#f8b500"
BP_GRID   = "#1a3a5c"

CK_BG     = "#2d4a3e"
CK_WHITE  = "#E8E8E8"
CK_YELLOW = "#F4D03F"

ML_BG   = "#fafafa"
ML_DARK = "#1a1a2e"
ML_RED  = "#e74c3c"

SM_BG     = "#1a1a2e"
SM_BLUE   = "#4a90d9"
SM_PURPLE = "#9b59b6"

GW_BG = "#0d1117"

GL_BG    = "#2d1b69"
GL_WHITE = "#ffffff"
GL_FROST = "#b8c6db"

PT_BG    = "#0a0a1a"
PT_GREEN = "#58D68D"
PT_GOLD  = "#F5B041"

# ═══════════════════════════════════════════════════════════
# LAYOUT (portrait frame: x in [-4.5, 4.5], y in [-8, 8])
# ═══════════════════════════════════════════════════════════

CC = np.array([0, 1.5, 0])
CR = 2.0


# ═══════════════════════════════════════════════════════════
# HELPERS
# ═══════════════════════════════════════════════════════════

def glow(mob, layers=4, extra=10):
    """Wrap a stroked mobject with glow layers."""
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


def make_badge(num_str, num_color):
    """Number badge only — no style name shown."""
    n = Text(num_str, font_size=48, color=num_color, weight=BOLD)
    n.move_to([0, 6.5, 0])
    return n


def make_label(term, desc, term_color, desc_color=WHITE):
    t = Text(term, font_size=58, color=term_color, weight=BOLD)
    d = Text(desc, font_size=24, color=desc_color)
    d.set_opacity(0.85)
    grp = VGroup(t, d).arrange(DOWN, buff=0.35)
    grp.move_to([0, -4.5, 0])
    return grp


def pt(angle):
    return CC + CR * np.array([np.cos(angle), np.sin(angle), 0])


def make_circle(**kw):
    c = Circle(radius=CR, **kw)
    c.move_to(CC)
    return c


def fadeout_all(scene, duration=0.3):
    if scene.mobjects:
        scene.play(*[FadeOut(m) for m in scene.mobjects], run_time=duration)


# ═══════════════════════════════════════════════════════════
# SCENE 0 — HOOK  (~10s to match narration intro)
# ═══════════════════════════════════════════════════════════

class HookScene(Scene):
    def construct(self):
        self.camera.background_color = "#0a0a0a"

        stop = Text("STOP.", font_size=96, color=RED, weight=BOLD)
        stop.move_to(UP * 3)

        l1 = Text("Before you master", font_size=40, color=WHITE)
        l2 = Text("CIRCLE GEOMETRY", font_size=56, color=NEON_CYAN, weight=BOLD)
        l3 = Text("in Matric...", font_size=40, color=WHITE)
        msg = VGroup(l1, l2, l3).arrange(DOWN, buff=0.4)

        bot = Text("Know these 8 terms.", font_size=46, color=CK_YELLOW, weight=BOLD)
        bot.move_to(DOWN * 4)

        self.play(FadeIn(stop, scale=1.5), run_time=0.4)
        self.wait(0.5)
        self.play(FadeIn(msg, shift=UP * 0.3), run_time=0.6)
        self.wait(0.5)
        self.play(Write(bot), run_time=0.5)
        self.wait(7.0)
        fadeout_all(self)


# ═══════════════════════════════════════════════════════════
# 1. RADIUS — Neon Glow  (~7s)
# ═══════════════════════════════════════════════════════════

class S1_Radius_NeonGlow(Scene):
    def construct(self):
        self.camera.background_color = NEON_BG

        bdg = make_badge("01", NEON_MAGENTA)
        circle = make_circle(stroke_color=NEON_CYAN, stroke_width=2)
        circle_g = glow(circle)

        o_dot = Dot(CC, radius=0.08, color=NEON_MAGENTA)
        o_lbl = Text("O", font_size=24, color=NEON_MAGENTA).next_to(o_dot, DL, buff=0.12)

        p = pt(PI / 4)
        radius_line = Line(CC, p, stroke_color=NEON_MAGENTA, stroke_width=3)
        radius_g = glow(radius_line, layers=3, extra=8)

        p_dot = Dot(p, radius=0.08, color=NEON_PINK)
        p_lbl = Text("P", font_size=24, color=NEON_PINK).next_to(p_dot, UR, buff=0.12)

        label = make_label("RADIUS", "Centre to circumference", NEON_CYAN)

        self.play(FadeIn(bdg), run_time=0.3)
        self.play(Create(circle_g), run_time=0.6)
        self.play(FadeIn(o_dot), Write(o_lbl), run_time=0.3)
        self.play(Create(radius_g), FadeIn(p_dot), Write(p_lbl), run_time=0.6)
        self.play(FadeIn(label), run_time=0.4)
        self.wait(4.5)
        fadeout_all(self)


# ═══════════════════════════════════════════════════════════
# 2. DIAMETER — Blueprint  (~10s)
# ═══════════════════════════════════════════════════════════

class S2_Diameter_Blueprint(Scene):
    def construct(self):
        self.camera.background_color = BP_BG

        grid = NumberPlane(
            x_range=[-5, 5, 1], y_range=[-9, 9, 1],
            background_line_style={
                "stroke_color": BP_GRID,
                "stroke_opacity": 0.25,
                "stroke_width": 1,
            },
            axis_config={"stroke_opacity": 0},
        )
        self.add(grid)

        bdg = make_badge("02", BP_ACCENT)
        circle = DashedVMobject(
            make_circle(stroke_color=BP_LINE, stroke_width=2),
            num_dashes=30,
        )

        a, d = pt(PI), pt(0)
        dia = Line(a, d, stroke_color=BP_ACCENT, stroke_width=3)

        o_dot = Dot(CC, radius=0.06, color=WHITE)
        a_dot = Dot(a, radius=0.06, color=WHITE)
        d_dot = Dot(d, radius=0.06, color=WHITE)

        dim_lbl = Text("2r", font_size=30, color=BP_ACCENT, weight=BOLD)
        dim_lbl.next_to(dia, DOWN, buff=0.25)

        label = make_label("DIAMETER", "Through centre  |  Longest chord  |  2 x radius", BP_ACCENT, BP_LINE)

        self.play(FadeIn(bdg), run_time=0.3)
        self.play(Create(circle), run_time=0.6)
        self.play(Create(dia), FadeIn(o_dot), FadeIn(a_dot), FadeIn(d_dot), run_time=0.6)
        self.play(Write(dim_lbl), run_time=0.3)
        self.play(FadeIn(label), run_time=0.4)
        self.wait(7.5)
        fadeout_all(self)


# ═══════════════════════════════════════════════════════════
# 3. CHORD — Chalkboard  (~10s)
# ═══════════════════════════════════════════════════════════

class S3_Chord_Chalkboard(Scene):
    def construct(self):
        self.camera.background_color = CK_BG

        bdg = make_badge("03", CK_YELLOW)
        circle = make_circle(stroke_color=CK_WHITE, stroke_width=2.5)

        a, b = pt(2 * PI / 3), pt(-PI / 6)
        chord = Line(a, b, stroke_color=CK_YELLOW, stroke_width=3)
        a_dot = Dot(a, radius=0.07, color=CK_YELLOW)
        b_dot = Dot(b, radius=0.07, color=CK_YELLOW)
        a_lbl = Text("A", font_size=22, color=CK_YELLOW).next_to(a_dot, UL, buff=0.1)
        b_lbl = Text("B", font_size=22, color=CK_YELLOW).next_to(b_dot, DR, buff=0.1)

        note = Text("(not through centre)", font_size=18, color=CK_WHITE)
        note.set_opacity(0.5)
        note.next_to(chord, UP, buff=0.3)

        label = make_label("CHORD", "Connects two points on circumference", CK_YELLOW, CK_WHITE)

        self.play(FadeIn(bdg), run_time=0.3)
        self.play(Create(circle), run_time=0.5)
        self.play(Create(chord), FadeIn(a_dot), FadeIn(b_dot), run_time=0.6)
        self.play(Write(a_lbl), Write(b_lbl), FadeIn(note), run_time=0.4)
        self.play(FadeIn(label), run_time=0.4)
        self.wait(7.5)
        fadeout_all(self)


# ═══════════════════════════════════════════════════════════
# 4. TANGENT — Minimal Line Art  (~7s)
# ═══════════════════════════════════════════════════════════

class S4_Tangent_MinimalLineArt(Scene):
    def construct(self):
        self.camera.background_color = ML_BG

        bdg = make_badge("04", ML_RED)
        circle = make_circle(stroke_color=ML_DARK, stroke_width=2, fill_opacity=0)

        tp = pt(PI / 2)
        tangent = Line(tp + LEFT * 3.5, tp + RIGHT * 3.5, stroke_color=ML_RED, stroke_width=2.5)
        tp_dot = Dot(tp, radius=0.07, color=ML_RED)

        r_line = Line(CC, tp, stroke_color=ML_DARK, stroke_width=1.5)
        r_line.set_opacity(0.5)

        sq = 0.25
        right_angle = VMobject()
        right_angle.set_points_as_corners([
            tp + LEFT * sq,
            tp + LEFT * sq + DOWN * sq,
            tp + DOWN * sq,
        ])
        right_angle.set_stroke(color=ML_RED, width=1.5)

        label = make_label("TANGENT", "Touches at exactly one point", ML_RED, ML_DARK)

        self.play(FadeIn(bdg), run_time=0.3)
        self.play(Create(circle), run_time=0.5)
        self.play(Create(tangent), FadeIn(tp_dot), run_time=0.6)
        self.play(Create(r_line), Create(right_angle), run_time=0.5)
        self.play(FadeIn(label), run_time=0.4)
        self.wait(4.5)
        fadeout_all(self)


# ═══════════════════════════════════════════════════════════
# 5. ARC — Shape Morphing  (~8s)
# ═══════════════════════════════════════════════════════════

class S5_Arc_ShapeMorphing(Scene):
    def construct(self):
        self.camera.background_color = SM_BG

        bdg = make_badge("05", SM_PURPLE)
        circle = make_circle(stroke_color=SM_BLUE, stroke_width=2, stroke_opacity=0.35)

        start_a = -PI / 6
        arc_angle = PI / 2

        minor_arc = Arc(
            radius=CR, start_angle=start_a, angle=arc_angle,
            arc_center=CC, stroke_color=SM_BLUE, stroke_width=4,
        )
        major_arc = Arc(
            radius=CR, start_angle=start_a + arc_angle,
            angle=2 * PI - arc_angle,
            arc_center=CC, stroke_color=SM_PURPLE, stroke_width=4,
        )

        p1_dot = Dot(pt(start_a), radius=0.08, color=SM_BLUE)
        p2_dot = Dot(pt(start_a + arc_angle), radius=0.08, color=SM_BLUE)
        tracer = Dot(pt(start_a), radius=0.1, color=WHITE)

        minor_lbl = Text("minor", font_size=20, color=SM_BLUE)
        minor_mid = start_a + arc_angle / 2
        minor_lbl.move_to(CC + (CR + 0.5) * np.array([np.cos(minor_mid), np.sin(minor_mid), 0]))

        major_lbl = Text("major", font_size=20, color=SM_PURPLE)
        major_mid = start_a + arc_angle + (2 * PI - arc_angle) / 2
        major_lbl.move_to(CC + (CR + 0.5) * np.array([np.cos(major_mid), np.sin(major_mid), 0]))

        label = make_label("ARC", "Part of the circumference", SM_PURPLE, WHITE)

        self.play(FadeIn(bdg), run_time=0.3)
        self.play(Create(circle), FadeIn(p1_dot), FadeIn(p2_dot), run_time=0.4)
        self.play(Create(minor_arc), MoveAlongPath(tracer, minor_arc), run_time=0.6)
        self.play(FadeIn(minor_lbl), run_time=0.2)
        self.play(Create(major_arc), MoveAlongPath(tracer, major_arc), run_time=1.0)
        self.play(FadeIn(major_lbl), FadeOut(tracer), run_time=0.3)
        self.play(FadeIn(label), run_time=0.4)
        self.wait(4.5)
        fadeout_all(self)


# ═══════════════════════════════════════════════════════════
# 6. SECTOR — Gradient Wave  (~6s)
# ═══════════════════════════════════════════════════════════

class S6_Sector_GradientWave(Scene):
    def construct(self):
        self.camera.background_color = GW_BG

        bdg = make_badge("06", "#ffd93d")
        circle = make_circle(stroke_color=WHITE, stroke_width=1.5, stroke_opacity=0.3)

        sector = AnnularSector(
            inner_radius=0,
            outer_radius=CR,
            start_angle=PI / 6,
            angle=PI / 2.5,
        )
        sector.set_fill(opacity=0.8)
        sector.set_color_by_gradient(RED, ORANGE, YELLOW)
        sector.set_stroke(color=WHITE, width=2)
        sector.move_arc_center_to(CC)

        r1 = Line(CC, pt(PI / 6), stroke_color=WHITE, stroke_width=1.5)
        r2 = Line(CC, pt(PI / 6 + PI / 2.5), stroke_color=WHITE, stroke_width=1.5)
        o_dot = Dot(CC, radius=0.06, color=WHITE)

        pizza = Text("pizza slice", font_size=20, color="#ffd93d")
        pizza.set_opacity(0.7)
        mid_angle = PI / 6 + PI / 5
        pizza.move_to(CC + (CR * 0.5) * np.array([np.cos(mid_angle), np.sin(mid_angle), 0]))

        label = make_label("SECTOR", "Two radii + an arc = pizza slice", "#ffd93d", WHITE)

        self.play(FadeIn(bdg), run_time=0.3)
        self.play(Create(circle), run_time=0.4)
        self.play(Create(r1), Create(r2), FadeIn(o_dot), run_time=0.4)
        self.play(FadeIn(sector), run_time=0.6)
        self.play(FadeIn(pizza), run_time=0.3)
        self.play(FadeIn(label), run_time=0.4)
        self.wait(3.5)
        fadeout_all(self)


# ═══════════════════════════════════════════════════════════
# 7. SEGMENT — Glassmorphism  (~8s)
# ═══════════════════════════════════════════════════════════

class S7_Segment_Glassmorphism(Scene):
    def construct(self):
        self.camera.background_color = GL_BG

        blob1 = Circle(radius=3, fill_color="#9b59b6", fill_opacity=0.12, stroke_width=0)
        blob1.move_to([-2, 4, 0])
        blob2 = Circle(radius=2.5, fill_color="#3498db", fill_opacity=0.12, stroke_width=0)
        blob2.move_to([2, -1, 0])
        self.add(blob1, blob2)

        bdg = make_badge("07", GL_WHITE)
        circle = make_circle(stroke_color=GL_WHITE, stroke_width=2, stroke_opacity=0.6)

        a1, a2 = PI / 4, 3 * PI / 4
        p1, p2 = pt(a1), pt(a2)
        chord = Line(p1, p2, stroke_color=GL_WHITE, stroke_width=2)

        seg = VMobject()
        arc_temp = Arc(radius=CR, start_angle=a1, angle=(a2 - a1), arc_center=CC)
        seg.set_points(arc_temp.get_points())
        seg.add_line_to(pt(a1))
        seg.set_fill(color=GL_FROST, opacity=0.3)
        seg.set_stroke(color=GL_WHITE, width=1.5, opacity=0.4)

        seg_lbl = Text("segment", font_size=22, color=GL_WHITE)
        seg_lbl.set_opacity(0.8)
        seg_lbl.move_to(CC + UP * (CR - 0.4))

        chord_lbl = Text("chord", font_size=18, color=GL_FROST)
        chord_lbl.set_opacity(0.6)
        chord_lbl.next_to(chord, DOWN, buff=0.15)

        label = make_label("SEGMENT", "Region between a chord and an arc", GL_WHITE, GL_FROST)

        self.play(FadeIn(bdg), run_time=0.3)
        self.play(Create(circle), run_time=0.5)
        self.play(Create(chord), FadeIn(chord_lbl), run_time=0.4)
        self.play(FadeIn(seg), FadeIn(seg_lbl), run_time=0.6)
        self.play(FadeIn(label), run_time=0.4)
        self.wait(5.5)
        fadeout_all(self)


# ═══════════════════════════════════════════════════════════
# 8. SECANT — Particle Trail  (~9s)
# ═══════════════════════════════════════════════════════════

class S8_Secant_ParticleTrail(Scene):
    def construct(self):
        self.camera.background_color = PT_BG

        bdg = make_badge("08", PT_GOLD)
        circle = make_circle(stroke_color=PT_GREEN, stroke_width=2, stroke_opacity=0.5)

        a1, a2 = PI / 6, 5 * PI / 6
        p1, p2 = pt(a1), pt(a2)
        direction = (p2 - p1) / np.linalg.norm(p2 - p1)
        ext1 = p1 - direction * 1.8
        ext2 = p2 + direction * 1.8

        secant = Line(ext1, ext2, stroke_color=PT_GOLD, stroke_width=2.5)
        p1_dot = Dot(p1, radius=0.08, color=PT_GREEN)
        p2_dot = Dot(p2, radius=0.08, color=PT_GREEN)

        path = Line(ext1, ext2)
        particle = Dot(ext1, radius=0.12, color=PT_GOLD)

        label = make_label("SECANT", "Cuts through circle at two points", PT_GOLD, PT_GREEN)

        self.play(FadeIn(bdg), run_time=0.3)
        self.play(Create(circle), run_time=0.5)
        self.play(Create(secant), FadeIn(p1_dot), FadeIn(p2_dot), run_time=0.5)
        self.play(MoveAlongPath(particle, path), run_time=0.8)
        self.play(FadeOut(particle), run_time=0.15)
        self.play(FadeIn(label), run_time=0.4)
        self.wait(6.0)
        fadeout_all(self)


# ═══════════════════════════════════════════════════════════
# SCENE 9 — SUMMARY  (~10s)
# ═══════════════════════════════════════════════════════════

class SummaryScene(Scene):
    def construct(self):
        self.camera.background_color = "#0a0a0a"

        title = Text("THE 8 ESSENTIALS", font_size=46, color=NEON_CYAN, weight=BOLD)
        title.move_to(UP * 6.5)

        terms = [
            ("01", "Radius",   NEON_MAGENTA),
            ("02", "Diameter", BP_ACCENT),
            ("03", "Chord",    CK_YELLOW),
            ("04", "Tangent",  ML_RED),
            ("05", "Arc",      SM_PURPLE),
            ("06", "Sector",   "#ffd93d"),
            ("07", "Segment",  GL_WHITE),
            ("08", "Secant",   PT_GOLD),
        ]

        items = VGroup()
        for num, name, color in terms:
            n = Text(num, font_size=26, color=color, weight=BOLD)
            t = Text(name, font_size=32, color=WHITE)
            row = VGroup(n, t).arrange(RIGHT, buff=0.4)
            items.add(row)

        items.arrange(DOWN, buff=0.3, aligned_edge=LEFT)
        items.move_to(UP * 0.5)

        cta1 = Text("Master these and circle geometry", font_size=28, color=WHITE)
        cta2 = Text("becomes 10x easier.", font_size=34, color=CK_YELLOW, weight=BOLD)
        cta3 = Text("SAVE THIS.", font_size=30, color=NEON_CYAN, weight=BOLD)
        cta = VGroup(cta1, cta2, cta3).arrange(DOWN, buff=0.3)
        cta.move_to(DOWN * 5.5)

        self.play(Write(title), run_time=0.4)
        for item in items:
            self.play(FadeIn(item, shift=RIGHT * 0.3), run_time=0.18)
        self.wait(0.5)
        self.play(FadeIn(cta, shift=UP * 0.3), run_time=0.5)
        self.wait(7.0)
        fadeout_all(self, duration=0.4)
