import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import {
  generateIntroWithThumbnail,
  generateTheoryScene,
  generateWorkedExample
} from './manim-scenes/introduction-with-thumbnail';

const execAsync = promisify(exec);

export interface ManimScene {
  sceneType: 'circle_theorem' | 'differentiation' | 'graph' | 'geometry' | 'intro_with_thumbnail' | 'theory' | 'worked_example';
  concept: string;
  parameters: {
    theorem?: string;
    angle?: number;
    showProof?: boolean;
    function?: string;
    xValue?: number;
    showTangent?: boolean;
    customCode?: string;
    // Thumbnail transition parameters
    thumbnailPath?: string;
    examRelevance?: string;
    difficulty?: 'foundation' | 'higher' | 'advanced';
    title?: string;
    givenAngle?: number;
    // Audio-first sync parameter
    targetDuration?: number;
  };
}

export interface ManimRenderResult {
  videoPath: string;
  duration: number;
  scenes: number;
}

export class ManimRenderer {
  private manimPath = '/home/dachu/miniconda3/envs/aitools/bin/manim';
  private pythonPath = '/home/dachu/miniconda3/envs/aitools/bin/python';
  private scriptsDir = 'output/manim/scripts';
  private videosDir = 'media/videos';

  constructor() {
    this.ensureDirectories();
  }

  /**
   * Ensure output directories exist
   */
  private async ensureDirectories(): Promise<void> {
    await fs.mkdir(this.scriptsDir, { recursive: true });
  }

  /**
   * Generate Manim animation from concept
   */
  async renderAnimation(scene: ManimScene, quality: 'low' | 'medium' | 'high' = 'low'): Promise<string> {
    console.log(`🎬 Starting Manim render: ${scene.concept}`);

    // 1. Generate Python script
    const scriptPath = await this.generateScript(scene);

    // 2. Execute Manim
    const videoPath = await this.executeManim(scriptPath, scene.concept, quality);

    console.log(`✅ Manim render complete: ${videoPath}`);
    return videoPath;
  }

  /**
   * Generate Python Manim script from parameters
   */
  private async generateScript(scene: ManimScene): Promise<string> {
    let pythonCode = '';

    switch (scene.sceneType) {
      case 'intro_with_thumbnail':
        pythonCode = generateIntroWithThumbnail(
          scene.parameters.title || scene.concept,
          scene.parameters.thumbnailPath || '',
          scene.parameters.examRelevance,
          scene.parameters.difficulty,
          scene.parameters.targetDuration
        );
        break;
      case 'theory':
        pythonCode = generateTheoryScene(
          scene.parameters.title || scene.concept,
          scene.parameters.theorem || scene.concept,
          scene.parameters.angle || 120,
          scene.parameters.targetDuration
        );
        break;
      case 'worked_example':
        pythonCode = generateWorkedExample(
          scene.parameters.title || scene.concept,
          scene.parameters.givenAngle || scene.parameters.angle || 100,
          scene.parameters.targetDuration
        );
        break;
      case 'circle_theorem':
        pythonCode = this.generateCircleTheorem(scene);
        break;
      case 'differentiation':
        pythonCode = this.generateDifferentiation(scene);
        break;
      case 'graph':
        pythonCode = this.generateGraph(scene);
        break;
      case 'geometry':
        pythonCode = this.generateGeometry(scene);
        break;
    }

    // Save Python script
    const scriptName = `${scene.concept.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.py`;
    const scriptPath = path.join(this.scriptsDir, scriptName);

    await fs.writeFile(scriptPath, pythonCode);
    console.log(`📝 Generated script: ${scriptPath}`);

    return scriptPath;
  }

  /**
   * Circle Theorem Animation Generator
   */
  private generateCircleTheorem(scene: ManimScene): string {
    const { theorem = 'Circle Theorem', angle = 120, showProof = true } = scene.parameters;

    // Sanitize theorem name for class
    const className = theorem.replace(/[^a-zA-Z0-9]/g, '');

    return `#!/usr/bin/env python3
from manim import *

class ${className}(Scene):
    def construct(self):
        # Title
        title = Text("${theorem}", font_size=40)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(0.5)

        # Draw circle
        circle = Circle(radius=2.5, color=BLUE)
        circle.shift(LEFT * 2)
        self.play(Create(circle))
        self.wait(0.5)

        # Draw center
        center = Dot(circle.get_center(), color=RED)
        center_label = Text("O", font_size=28).next_to(center, DOWN, buff=0.2)
        self.play(FadeIn(center, center_label))
        self.wait(0.5)

        ${this.getTheoremAnimation(theorem, angle)}

        # Hold final frame
        self.wait(2)
`;
  }

  /**
   * Theorem-specific animations
   */
  private getTheoremAnimation(theorem: string, angle: number): string {
    const theoremLower = theorem.toLowerCase();

    if (theoremLower.includes('angle at centre') || theoremLower.includes('angle at center')) {
      return this.getAngleAtCentreAnimation(angle);
    } else if (theoremLower.includes('tangent')) {
      return this.getTangentRadiusAnimation();
    } else if (theoremLower.includes('same segment')) {
      return this.getSameSegmentAnimation();
    } else if (theoremLower.includes('cyclic quadrilateral')) {
      return this.getCyclicQuadrilateralAnimation();
    } else if (theoremLower.includes('alternate segment')) {
      return this.getAlternateSegmentAnimation();
    } else if (theoremLower.includes('chord')) {
      return this.getChordAnimation();
    }

    // Default animation
    return `        # Generic circle animation
        self.wait(1)`;
  }

  /**
   * Angle at Centre Theorem Animation
   */
  private getAngleAtCentreAnimation(angle: number): string {
    const circumAngle = angle / 2;

    return `        # Points on circumference
        point_A = circle.point_at_angle(PI/3)
        point_B = circle.point_at_angle(-PI/3)
        point_C = circle.point_at_angle(PI)

        dot_A = Dot(point_A, color=YELLOW)
        dot_B = Dot(point_B, color=YELLOW)
        dot_C = Dot(point_C, color=YELLOW)

        label_A = Text("A", font_size=28).next_to(dot_A, UR, buff=0.1)
        label_B = Text("B", font_size=28).next_to(dot_B, DR, buff=0.1)
        label_C = Text("C", font_size=28).next_to(dot_C, LEFT, buff=0.1)

        self.play(
            FadeIn(dot_A, label_A),
            FadeIn(dot_B, label_B)
        )
        self.wait(0.5)

        # Draw angle at centre
        line_OA = Line(circle.get_center(), point_A, color=GREEN)
        line_OB = Line(circle.get_center(), point_B, color=GREEN)

        self.play(Create(line_OA), Create(line_OB))
        self.wait(0.5)

        # Angle marker at centre
        angle_centre = Angle(line_OB, line_OA, radius=0.6, color=RED)
        angle_centre_label = Text("${angle}", font_size=24, color=RED).next_to(angle_centre, RIGHT, buff=0.2)

        self.play(Create(angle_centre), Write(angle_centre_label))
        self.wait(1)

        # Add point C and draw angle at circumference
        self.play(FadeIn(dot_C, label_C))
        self.wait(0.5)

        line_CA = Line(point_C, point_A, color=PURPLE)
        line_CB = Line(point_C, point_B, color=PURPLE)

        self.play(Create(line_CA), Create(line_CB))
        self.wait(0.5)

        # Angle marker at circumference
        angle_circum = Angle(line_CB, line_CA, radius=0.4, color=ORANGE)
        angle_circum_label = Text("${circumAngle}", font_size=24, color=ORANGE).next_to(angle_circum, UP, buff=0.2)

        self.play(Create(angle_circum), Write(angle_circum_label))
        self.wait(1)

        # Explanation
        explanation = VGroup(
            Text("Centre = 2 x Circumference", font_size=28),
            Text("${angle} = 2 x ${circumAngle}", font_size=24, color=YELLOW)
        ).arrange(DOWN, buff=0.3)
        explanation.to_edge(RIGHT, buff=1)
        explanation.shift(DOWN * 0.5)

        bg_rect = SurroundingRectangle(explanation, color=WHITE, buff=0.3, corner_radius=0.1)
        bg_rect.set_fill(color=BLACK, opacity=0.8)

        self.play(FadeIn(bg_rect), Write(explanation))
        self.wait(2)`;
  }

  /**
   * Tangent-Radius Right Angle Animation
   */
  private getTangentRadiusAnimation(): string {
    return `        # Tangent point
        tangent_point = circle.point_at_angle(PI/4)
        dot_T = Dot(tangent_point, color=YELLOW)
        label_T = Text("T", font_size=28).next_to(dot_T, UR, buff=0.1)

        self.play(FadeIn(dot_T, label_T))
        self.wait(0.5)

        # Radius to tangent point
        radius = Line(circle.get_center(), tangent_point, color=GREEN)
        self.play(Create(radius))
        self.wait(0.5)

        # Tangent line
        tangent_direction = np.array([
            -np.sin(PI/4),
            np.cos(PI/4),
            0
        ])
        tangent_start = tangent_point + tangent_direction * 1.5
        tangent_end = tangent_point - tangent_direction * 1.5
        tangent = Line(tangent_start, tangent_end, color=PURPLE)

        self.play(Create(tangent))
        self.wait(0.5)

        # Right angle marker
        right_angle = RightAngle(radius, tangent, length=0.4, color=YELLOW)
        angle_label = Text("90", font_size=24, color=YELLOW).next_to(right_angle, UR, buff=0.1)

        self.play(Create(right_angle), Write(angle_label))
        self.wait(1)

        # Explanation
        explanation = Text("Radius meets tangent at 90°", font_size=28)
        explanation.to_edge(RIGHT, buff=1)
        explanation.shift(DOWN * 0.5)

        bg_rect = SurroundingRectangle(explanation, color=WHITE, buff=0.3, corner_radius=0.1)
        bg_rect.set_fill(color=BLACK, opacity=0.8)

        self.play(FadeIn(bg_rect), Write(explanation))
        self.wait(2)`;
  }

  /**
   * Angles in Same Segment Animation
   */
  private getSameSegmentAnimation(): string {
    return `        # Points on circumference
        point_A = circle.point_at_angle(0.3)
        point_B = circle.point_at_angle(-0.3)
        point_C = circle.point_at_angle(2.5)
        point_D = circle.point_at_angle(2.0)

        dots = [
            Dot(point_A, color=YELLOW),
            Dot(point_B, color=YELLOW),
            Dot(point_C, color=YELLOW),
            Dot(point_D, color=YELLOW)
        ]

        labels = [
            Text("A", font_size=28).next_to(point_A, RIGHT, buff=0.1),
            Text("B", font_size=28).next_to(point_B, RIGHT, buff=0.1),
            Text("C", font_size=28).next_to(point_C, LEFT, buff=0.1),
            Text("D", font_size=28).next_to(point_D, LEFT, buff=0.1)
        ]

        self.play(*[FadeIn(d, l) for d, l in zip(dots, labels)])
        self.wait(0.5)

        # Draw chords and angles
        line_CA = Line(point_C, point_A, color=PURPLE)
        line_CB = Line(point_C, point_B, color=PURPLE)
        angle_C = Angle(line_CB, line_CA, radius=0.4, color=RED)
        label_C = Text("x", font_size=24, color=RED).next_to(angle_C, DOWN, buff=0.1)

        self.play(Create(line_CA), Create(line_CB))
        self.play(Create(angle_C), Write(label_C))
        self.wait(1)

        # Second angle
        line_DA = Line(point_D, point_A, color=GREEN)
        line_DB = Line(point_D, point_B, color=GREEN)
        angle_D = Angle(line_DB, line_DA, radius=0.4, color=ORANGE)
        label_D = Text("x", font_size=24, color=ORANGE).next_to(angle_D, DOWN, buff=0.1)

        self.play(Create(line_DA), Create(line_DB))
        self.play(Create(angle_D), Write(label_D))
        self.wait(1)

        # Explanation
        explanation = Text("Angles in same segment are equal", font_size=28)
        explanation.to_edge(RIGHT, buff=1)

        bg_rect = SurroundingRectangle(explanation, color=WHITE, buff=0.3, corner_radius=0.1)
        bg_rect.set_fill(color=BLACK, opacity=0.8)

        self.play(FadeIn(bg_rect), Write(explanation))
        self.wait(2)`;
  }

  /**
   * Cyclic Quadrilateral Animation
   */
  private getCyclicQuadrilateralAnimation(): string {
    return `        # Four points on circumference
        points = [
            circle.point_at_angle(0.5),
            circle.point_at_angle(1.8),
            circle.point_at_angle(3.5),
            circle.point_at_angle(5.0)
        ]

        dots = [Dot(p, color=YELLOW) for p in points]
        labels = [
            Text(letter, font_size=28).next_to(points[i], direction, buff=0.1)
            for i, (letter, direction) in enumerate([
                ("A", UR), ("B", UL), ("C", DL), ("D", DR)
            ])
        ]

        self.play(*[FadeIn(d, l) for d, l in zip(dots, labels)])
        self.wait(0.5)

        # Draw quadrilateral
        quad_lines = [
            Line(points[i], points[(i+1)%4], color=BLUE)
            for i in range(4)
        ]

        self.play(*[Create(line) for line in quad_lines])
        self.wait(0.5)

        # Highlight opposite angles
        angle_A = Angle(quad_lines[3], quad_lines[0], radius=0.4, color=RED)
        angle_C = Angle(quad_lines[1], quad_lines[2], radius=0.4, color=RED)

        label_A = Text("a", font_size=24, color=RED).next_to(points[0], LEFT, buff=0.3)
        label_C = Text("c", font_size=24, color=RED).next_to(points[2], RIGHT, buff=0.3)

        self.play(Create(angle_A), Create(angle_C))
        self.play(Write(label_A), Write(label_C))
        self.wait(1)

        # Explanation
        explanation = VGroup(
            Text("Opposite angles", font_size=28),
            Text("add to 180°", font_size=28, color=YELLOW)
        ).arrange(DOWN, buff=0.2)
        explanation.to_edge(RIGHT, buff=1)

        bg_rect = SurroundingRectangle(explanation, color=WHITE, buff=0.3, corner_radius=0.1)
        bg_rect.set_fill(color=BLACK, opacity=0.8)

        self.play(FadeIn(bg_rect), Write(explanation))
        self.wait(2)`;
  }

  /**
   * Alternate Segment Theorem Animation
   */
  private getAlternateSegmentAnimation(): string {
    return `        # Point on circle
        point_P = circle.point_at_angle(0.8)
        dot_P = Dot(point_P, color=YELLOW)
        label_P = Text("P", font_size=28).next_to(dot_P, UP, buff=0.1)

        self.play(FadeIn(dot_P, label_P))
        self.wait(0.5)

        # Tangent
        tangent_direction = rotate_vector(point_P - circle.get_center(), PI/2)
        tangent_direction = tangent_direction / np.linalg.norm(tangent_direction)
        tangent = Line(
            point_P - tangent_direction * 1.5,
            point_P + tangent_direction * 1.5,
            color=PURPLE
        )

        self.play(Create(tangent))
        self.wait(0.5)

        # Chord
        point_Q = circle.point_at_angle(2.2)
        dot_Q = Dot(point_Q, color=YELLOW)
        label_Q = Text("Q", font_size=28).next_to(dot_Q, LEFT, buff=0.1)

        chord = Line(point_P, point_Q, color=GREEN)

        self.play(FadeIn(dot_Q, label_Q))
        self.play(Create(chord))
        self.wait(0.5)

        # Angle between tangent and chord
        angle_tangent = Angle(chord, tangent, radius=0.5, color=RED)
        label_tangent = Text("x", font_size=24, color=RED).next_to(angle_tangent, RIGHT, buff=0.1)

        self.play(Create(angle_tangent), Write(label_tangent))
        self.wait(1)

        # Point in alternate segment
        point_R = circle.point_at_angle(4.5)
        dot_R = Dot(point_R, color=YELLOW)
        label_R = Text("R", font_size=28).next_to(dot_R, DOWN, buff=0.1)

        line_RP = Line(point_R, point_P, color=BLUE)
        line_RQ = Line(point_R, point_Q, color=BLUE)

        self.play(FadeIn(dot_R, label_R))
        self.play(Create(line_RP), Create(line_RQ))
        self.wait(0.5)

        # Angle in alternate segment
        angle_alternate = Angle(line_RQ, line_RP, radius=0.4, color=ORANGE)
        label_alternate = Text("x", font_size=24, color=ORANGE).next_to(angle_alternate, UP, buff=0.1)

        self.play(Create(angle_alternate), Write(label_alternate))
        self.wait(1)

        # Explanation
        explanation = Text("Alternate segment angles equal", font_size=28)
        explanation.to_edge(RIGHT, buff=1)

        bg_rect = SurroundingRectangle(explanation, color=WHITE, buff=0.3, corner_radius=0.1)
        bg_rect.set_fill(color=BLACK, opacity=0.8)

        self.play(FadeIn(bg_rect), Write(explanation))
        self.wait(2)`;
  }

  /**
   * Chord Properties Animation
   */
  private getChordAnimation(): string {
    return `        # Two equal chords
        chord1_start = circle.point_at_angle(0.5)
        chord1_end = circle.point_at_angle(2.0)
        chord1 = Line(chord1_start, chord1_end, color=GREEN)

        chord2_start = circle.point_at_angle(3.5)
        chord2_end = circle.point_at_angle(5.0)
        chord2 = Line(chord2_start, chord2_end, color=GREEN)

        self.play(Create(chord1), Create(chord2))
        self.wait(0.5)

        # Perpendiculars from center
        chord1_mid = (chord1_start + chord1_end) / 2
        chord2_mid = (chord2_start + chord2_end) / 2

        perp1 = Line(circle.get_center(), chord1_mid, color=RED)
        perp2 = Line(circle.get_center(), chord2_mid, color=RED)

        self.play(Create(perp1), Create(perp2))
        self.wait(0.5)

        # Mark right angles
        right_angle1 = RightAngle(perp1, chord1, length=0.3, color=YELLOW)
        right_angle2 = RightAngle(perp2, chord2, length=0.3, color=YELLOW)

        self.play(Create(right_angle1), Create(right_angle2))
        self.wait(1)

        # Explanation
        explanation = VGroup(
            Text("Equal chords are", font_size=28),
            Text("equidistant from centre", font_size=24, color=YELLOW)
        ).arrange(DOWN, buff=0.2)
        explanation.to_edge(RIGHT, buff=1)

        bg_rect = SurroundingRectangle(explanation, color=WHITE, buff=0.3, corner_radius=0.1)
        bg_rect.set_fill(color=BLACK, opacity=0.8)

        self.play(FadeIn(bg_rect), Write(explanation))
        self.wait(2)`;
  }

  /**
   * Differentiation Animation Generator
   */
  private generateDifferentiation(scene: ManimScene): string {
    const { function: func = 'x**2', xValue = 1, showTangent = true } = scene.parameters;
    const className = scene.concept.replace(/[^a-zA-Z0-9]/g, '');

    return `#!/usr/bin/env python3
from manim import *

class ${className}(Scene):
    def construct(self):
        # Title
        title = Text("${scene.concept}", font_size=36)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(0.5)

        # Setup axes
        axes = Axes(
            x_range=[-3, 3, 1],
            y_range=[-2, 10, 2],
            axis_config={"color": BLUE},
            x_length=8,
            y_length=6
        )

        labels = axes.get_axis_labels(x_label="x", y_label="y")

        self.play(Create(axes), Write(labels))
        self.wait(0.5)

        # Plot function
        curve = axes.plot(lambda x: ${func}, color=YELLOW, x_range=[-2.5, 2.5])
        curve_label = Text("y = ${func.replace('**', '^')}", font_size=28).to_corner(UR)

        self.play(Create(curve), Write(curve_label))
        self.wait(1)

        # Point on curve
        x_val = ${xValue}
        y_val = ${func.replace('x', `(${xValue})`)}
        point = Dot(axes.c2p(x_val, y_val), color=RED)
        point_label = Text(f"({x_val}, {y_val:.1f})", font_size=24).next_to(point, UR, buff=0.1)

        self.play(FadeIn(point), Write(point_label))
        self.wait(1)

        ${showTangent ? `
        # Draw tangent line
        # Calculate slope (derivative at x_val)
        h = 0.0001
        slope = ((${func.replace('x', `(x_val + h)`)}) - (${func.replace('x', 'x_val')})) / h

        tangent = axes.plot(
            lambda x: slope * (x - x_val) + y_val,
            color=GREEN,
            x_range=[x_val - 1.5, x_val + 1.5]
        )

        tangent_label = Text(f"Gradient = {slope:.2f}", font_size=24, color=GREEN).to_edge(DOWN)

        self.play(Create(tangent))
        self.wait(0.5)
        self.play(Write(tangent_label))
        self.wait(2)
        ` : 'self.wait(2)'}
`;
  }

  /**
   * Graph Animation Generator
   */
  private generateGraph(scene: ManimScene): string {
    const { function: func = 'x**2' } = scene.parameters;
    const className = scene.concept.replace(/[^a-zA-Z0-9]/g, '');

    return `#!/usr/bin/env python3
from manim import *

class ${className}(Scene):
    def construct(self):
        axes = Axes(
            x_range=[-5, 5, 1],
            y_range=[-5, 5, 1]
        )

        graph = axes.plot(lambda x: ${func}, color=BLUE)

        self.play(Create(axes))
        self.play(Create(graph))
        self.wait(2)
`;
  }

  /**
   * Geometry Animation Generator
   */
  private generateGeometry(scene: ManimScene): string {
    const { customCode = 'pass' } = scene.parameters;
    const className = scene.concept.replace(/[^a-zA-Z0-9]/g, '');

    return `#!/usr/bin/env python3
from manim import *

class ${className}(Scene):
    def construct(self):
        ${customCode}
`;
  }

  /**
   * Execute Manim command
   */
  private async executeManim(
    scriptPath: string,
    sceneName: string,
    quality: 'low' | 'medium' | 'high'
  ): Promise<string> {
    const qualityFlags = {
      low: '-ql',    // 480p15
      medium: '-qm', // 720p30
      high: '-qh'    // 1080p60
    };

    const qualityFlag = qualityFlags[quality];
    const className = sceneName.replace(/[^a-zA-Z0-9]/g, '');

    const command = `${this.manimPath} render ${scriptPath} ${className} ${qualityFlag} --format=mp4`;

    try {
      console.log(`🎬 Executing Manim: ${command}`);

      const { stdout, stderr } = await execAsync(command, {
        cwd: process.cwd(),
        timeout: 180000, // 3 minutes
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      });

      console.log('Manim output:', stdout);
      if (stderr) console.warn('Manim warnings:', stderr);

      // Parse output path from Manim logs (remove line breaks for wrapped paths)
      const cleanOutput = stdout.replace(/\n\s+/g, ' ');
      const match = cleanOutput.match(/File ready at\s+'([^']+\.mp4)'/);
      if (!match) {
        throw new Error('Could not find rendered video path in Manim output');
      }

      const videoPath = match[1];
      console.log(`✅ Video ready: ${videoPath}`);

      return videoPath;
    } catch (error: any) {
      console.error('Manim execution failed:', error);
      throw new Error(`Manim rendering failed: ${error.message}`);
    }
  }

  /**
   * Batch render multiple concepts
   */
  async renderBatch(scenes: ManimScene[]): Promise<ManimRenderResult[]> {
    const results: ManimRenderResult[] = [];

    for (const scene of scenes) {
      const videoPath = await this.renderAnimation(scene);

      results.push({
        videoPath,
        duration: 20, // TODO: Get actual duration from video
        scenes: 1
      });

      // Small delay between renders
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }
}

export default ManimRenderer;
