"""
Manim Spatial Configuration

Mirrors the D3 spatial config but for Manim animations.
Ensures consistent positioning, padding, and collision-free layouts.

CRITICAL: Import this in ALL Manim scripts for consistent output.
"""

from manim import *
import numpy as np

# ============================================================================
# CANVAS DIMENSIONS (Must match D3 config)
# ============================================================================

class CANVAS:
    """Canvas dimensions - 1080p video (16:9)"""
    WIDTH = 1920
    HEIGHT = 1080

    class PADDING:
        """Padding to prevent edge clipping"""
        OUTER = 50      # CRITICAL: keeps content off edges (mobile/TV safe)
        INNER = 20      # Between elements
        GROUP = 40      # Between groups
        STEP = 15       # Between steps (vertical)

    @staticmethod
    def get_safe_area():
        """Get usable area after padding"""
        return {
            'x': CANVAS.PADDING.OUTER,
            'y': CANVAS.PADDING.OUTER,
            'width': CANVAS.WIDTH - (CANVAS.PADDING.OUTER * 2),   # 1820
            'height': CANVAS.HEIGHT - (CANVAS.PADDING.OUTER * 2)  # 980
        }

# ============================================================================
# MANIM COORDINATE SYSTEM
# ============================================================================

class MANIM_COORDS:
    """
    Manim uses a different coordinate system than pixels:
    - Center of screen is (0, 0)
    - X increases to the right
    - Y increases UPWARD (not down like pixels)
    - Default frame: width=14.222, height=8

    We need to map pixel-based safe zones to Manim coords
    """

    # Manim's default frame dimensions
    FRAME_WIDTH = config.frame_width    # ~14.222
    FRAME_HEIGHT = config.frame_height  # ~8.0

    @staticmethod
    def pixel_to_manim_x(pixel_x):
        """Convert pixel X to Manim X coordinate"""
        # Map 0-1920 to -7.111 to 7.111
        normalized = (pixel_x / CANVAS.WIDTH) - 0.5
        return normalized * MANIM_COORDS.FRAME_WIDTH

    @staticmethod
    def pixel_to_manim_y(pixel_y):
        """Convert pixel Y to Manim Y coordinate"""
        # Map 0-1080 to 4 to -4 (Y is inverted)
        normalized = 0.5 - (pixel_y / CANVAS.HEIGHT)
        return normalized * MANIM_COORDS.FRAME_HEIGHT

    @staticmethod
    def get_safe_bounds():
        """Get Manim coordinates for safe zone"""
        safe_area = CANVAS.get_safe_area()

        return {
            'left': MANIM_COORDS.pixel_to_manim_x(safe_area['x']),
            'right': MANIM_COORDS.pixel_to_manim_x(safe_area['x'] + safe_area['width']),
            'top': MANIM_COORDS.pixel_to_manim_y(safe_area['y']),
            'bottom': MANIM_COORDS.pixel_to_manim_y(safe_area['y'] + safe_area['height'])
        }

# ============================================================================
# LAYOUT ZONES (Vertical division)
# ============================================================================

class ZONES:
    """Screen zones for content organization"""

    class TITLE:
        HEIGHT = 120  # px
        PADDING_TOP = 20
        PADDING_BOTTOM = 15

        @staticmethod
        def get_y():
            """Get Y coordinate for title zone (Manim coords)"""
            return MANIM_COORDS.pixel_to_manim_y(CANVAS.PADDING.OUTER + 60)

    class CONTENT:
        """Main content zone - where animations live"""

        @staticmethod
        def get_bounds():
            """Get content zone bounds in Manim coordinates"""
            title_height_px = ZONES.TITLE.HEIGHT
            footer_height_px = 60

            top_px = CANVAS.PADDING.OUTER + title_height_px
            bottom_px = CANVAS.HEIGHT - CANVAS.PADDING.OUTER - footer_height_px

            safe_area = CANVAS.get_safe_area()

            return {
                'left': MANIM_COORDS.pixel_to_manim_x(safe_area['x']),
                'right': MANIM_COORDS.pixel_to_manim_x(safe_area['x'] + safe_area['width']),
                'top': MANIM_COORDS.pixel_to_manim_y(top_px),
                'bottom': MANIM_COORDS.pixel_to_manim_y(bottom_px),
                'width': safe_area['width'],
                'height': bottom_px - top_px
            }

    class FOOTER:
        HEIGHT = 60

        @staticmethod
        def get_y():
            """Get Y coordinate for footer zone"""
            return MANIM_COORDS.pixel_to_manim_y(CANVAS.HEIGHT - CANVAS.PADDING.OUTER - 30)

# ============================================================================
# FONTS & SIZES
# ============================================================================

class FONTS:
    """Font configuration matching D3 system"""

    # Font families (Manim uses system fonts)
    DISPLAY = "Poppins"      # Engaging titles
    PRIMARY = "Inter"        # Body text
    HANDWRITING = "Caveat"   # Annotations
    MONO = "JetBrains Mono"  # Code/equations

    # Font sizes (Manim scale, not pixels)
    class SIZES:
        MAIN_TITLE = 56      # Large, attention-grabbing
        SUBTITLE = 36        # Secondary heading
        HEADING = 42         # Section headings
        BODY = 32            # Main content
        LABEL = 28           # Labels, captions
        SMALL = 22           # Small text
        TINY = 18            # Very small
        EQUATION = 38        # Math equations
        CODE = 28            # Code snippets

# ============================================================================
# COLORS (Blackboard aesthetic - matches D3)
# ============================================================================

class COLORS:
    """Color palette - blackboard style"""

    BACKGROUND = "#000000"  # Pure black

    # Chalk colors (vibrant, engaging)
    class CHALK:
        WHITE = "#ffffff"
        BLUE = "#3b82f6"
        GREEN = "#10b981"
        YELLOW = "#fbbf24"
        RED = "#ef4444"
        PURPLE = "#a78bfa"
        ORANGE = "#f97316"
        CYAN = "#06b6d4"

    # Muted versions
    class MUTED:
        BLUE = "#1e3a8a"
        GREEN = "#065f46"
        YELLOW = "#78350f"
        RED = "#7f1d1d"
        PURPLE = "#4c1d95"
        GRAY = "#374151"

# ============================================================================
# ELEMENT CONSTRAINTS (Collision avoidance)
# ============================================================================

class ELEMENT_CONSTRAINTS:
    """Spatial constraints for Manim objects"""

    class MOBJECT:
        """General mobject sizing"""
        MIN_SPACING = 0.3    # Minimum space between mobjects (Manim units)
        PADDING = 0.4        # Buffer around mobjects
        MAX_WIDTH = 12       # Max width before scaling down
        MAX_HEIGHT = 6       # Max height before scaling down

    class TEXT:
        """Text-specific constraints"""
        MIN_FONT_SIZE = 18
        MAX_FONT_SIZE = 72
        LINE_SPACING = 0.3
        MAX_WIDTH = 10       # Max text width before wrapping

    class SHAPE:
        """Shape constraints (circles, rectangles, etc.)"""
        MIN_RADIUS = 0.2
        MAX_RADIUS = 2.0
        STROKE_WIDTH_DEFAULT = 3
        STROKE_WIDTH_THICK = 5

# ============================================================================
# LAYOUT MODES
# ============================================================================

class LAYOUT_MODES:
    """Layout mode configurations"""

    @staticmethod
    def get_full():
        """Full canvas - single animation"""
        content = ZONES.CONTENT.get_bounds()
        return {
            'width': content['width'],
            'height': content['height'],
            'max_elements': 10,
            'bounds': content
        }

    @staticmethod
    def get_split():
        """Split mode - D3 left, Manim right"""
        content = ZONES.CONTENT.get_bounds()
        manim_width = (content['width'] / 2) - CANVAS.PADDING.GROUP

        return {
            'width': manim_width,
            'height': content['height'],
            'max_elements': 6,
            'bounds': {
                'left': 0,  # Manim center-based
                'right': content['right'],
                'top': content['top'],
                'bottom': content['bottom']
            }
        }

    @staticmethod
    def get_step_by_step(steps=3):
        """Step-by-step mode - vertical stack"""
        content = ZONES.CONTENT.get_bounds()
        step_height = (content['height'] - (steps - 1) * CANVAS.PADDING.STEP) / steps

        return {
            'step_height': step_height,
            'width': content['width'],
            'max_elements_per_step': 5,
            'steps': steps,
            'bounds': content
        }

    @staticmethod
    def get_grid(rows=2, cols=2):
        """Grid mode - multiple small animations"""
        content = ZONES.CONTENT.get_bounds()
        cell_width = (content['width'] - (cols - 1) * CANVAS.PADDING.GROUP) / cols
        cell_height = (content['height'] - (rows - 1) * CANVAS.PADDING.GROUP) / rows

        return {
            'cell_width': cell_width,
            'cell_height': cell_height,
            'max_elements_per_cell': 3,
            'rows': rows,
            'cols': cols,
            'bounds': content
        }

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_safe_position(x_percent, y_percent):
    """
    Get safe position within content zone

    Args:
        x_percent: 0.0 (left) to 1.0 (right)
        y_percent: 0.0 (top) to 1.0 (bottom)

    Returns:
        numpy array with [x, y, 0] in Manim coordinates
    """
    bounds = ZONES.CONTENT.get_bounds()

    x = bounds['left'] + (bounds['right'] - bounds['left']) * x_percent
    y = bounds['top'] + (bounds['bottom'] - bounds['top']) * (1 - y_percent)  # Invert Y

    return np.array([x, y, 0])

def ensure_safe_bounds(mobject):
    """
    Ensure mobject stays within safe zone
    Scales down if too large, shifts if outside bounds
    """
    bounds = MANIM_COORDS.get_safe_bounds()

    # Check if mobject exceeds bounds
    if mobject.get_width() > (bounds['right'] - bounds['left']) * 0.9:
        scale_factor = ((bounds['right'] - bounds['left']) * 0.9) / mobject.get_width()
        mobject.scale(scale_factor)

    if mobject.get_height() > (bounds['top'] - bounds['bottom']) * 0.9:
        scale_factor = ((bounds['top'] - bounds['bottom']) * 0.9) / mobject.get_height()
        mobject.scale(scale_factor)

    # Shift to center if needed
    center = mobject.get_center()
    if center[0] < bounds['left'] or center[0] > bounds['right']:
        mobject.move_to(ORIGIN)

    return mobject

def check_collision(mobject1, mobject2, buffer=None):
    """
    Check if two mobjects collide (including buffer)

    Args:
        mobject1: First Mobject
        mobject2: Second Mobject
        buffer: Safety buffer (default: ELEMENT_CONSTRAINTS.MOBJECT.PADDING)

    Returns:
        bool: True if collision detected
    """
    if buffer is None:
        buffer = ELEMENT_CONSTRAINTS.MOBJECT.PADDING

    # Get bounding boxes
    box1 = mobject1.get_bounding_box_point
    box2 = mobject2.get_bounding_box_point

    # Simple AABB collision detection
    distance = np.linalg.norm(mobject1.get_center() - mobject2.get_center())
    min_distance = (mobject1.get_width() + mobject2.get_width()) / 2 + buffer

    return distance < min_distance

def arrange_without_collision(mobjects, direction=RIGHT, buffer=None):
    """
    Arrange multiple mobjects without collisions

    Args:
        mobjects: List of Mobjects
        direction: Arrangement direction (RIGHT, DOWN, etc.)
        buffer: Spacing between objects

    Returns:
        VGroup with arranged mobjects
    """
    if buffer is None:
        buffer = ELEMENT_CONSTRAINTS.MOBJECT.MIN_SPACING

    group = VGroup(*mobjects)
    group.arrange(direction, buff=buffer)

    # Ensure group fits in safe zone
    ensure_safe_bounds(group)

    return group

# ============================================================================
# VALIDATION
# ============================================================================

class ManimValidator:
    """Validates Manim scenes for spatial compliance"""

    @staticmethod
    def validate_scene(scene):
        """
        Validate scene for spatial issues

        Returns:
            dict with 'valid', 'warnings', 'errors'
        """
        warnings = []
        errors = []

        bounds = MANIM_COORDS.get_safe_bounds()

        for mobject in scene.mobjects:
            # Check if mobject is within safe bounds
            center = mobject.get_center()

            if center[0] < bounds['left'] or center[0] > bounds['right']:
                warnings.append(f"Mobject {mobject} may be outside horizontal safe zone")

            if center[1] < bounds['bottom'] or center[1] > bounds['top']:
                warnings.append(f"Mobject {mobject} may be outside vertical safe zone")

            # Check for very large objects
            if mobject.get_width() > ELEMENT_CONSTRAINTS.MOBJECT.MAX_WIDTH:
                warnings.append(f"Mobject {mobject} exceeds max width ({mobject.get_width():.2f} > {ELEMENT_CONSTRAINTS.MOBJECT.MAX_WIDTH})")

            if mobject.get_height() > ELEMENT_CONSTRAINTS.MOBJECT.MAX_HEIGHT:
                warnings.append(f"Mobject {mobject} exceeds max height ({mobject.get_height():.2f} > {ELEMENT_CONSTRAINTS.MOBJECT.MAX_HEIGHT})")

        return {
            'valid': len(errors) == 0,
            'warnings': warnings,
            'errors': errors
        }

# ============================================================================
# USAGE EXAMPLE
# ============================================================================

"""
Example usage in Manim scene:

from manim_spatial_config import *

class MyScene(Scene):
    def construct(self):
        # Use safe positioning
        title = Text("My Title", font_size=FONTS.SIZES.MAIN_TITLE, color=COLORS.CHALK.WHITE)
        title.move_to(get_safe_position(0.5, 0.1))  # Center top

        # Ensure bounds
        ensure_safe_bounds(title)

        # Check collisions
        subtitle = Text("Subtitle", font_size=FONTS.SIZES.SUBTITLE)
        subtitle.next_to(title, DOWN, buff=ELEMENT_CONSTRAINTS.TEXT.LINE_SPACING)

        if check_collision(title, subtitle):
            print("WARNING: Title and subtitle colliding!")

        # Arrange without collisions
        items = [Circle(), Square(), Triangle()]
        arranged = arrange_without_collision(items, direction=RIGHT)

        self.add(title, subtitle, arranged)

        # Validate before rendering
        validation = ManimValidator.validate_scene(self)
        if not validation['valid']:
            print(f"Errors: {validation['errors']}")
        if validation['warnings']:
            print(f"Warnings: {validation['warnings']}")
"""
