/**
 * Unified D3 + Manim Renderer
 *
 * Renders D3 visualizations and Manim animations on the SAME frame
 *
 * Approaches:
 * 1. D3 → SVG → Manim SVGMobject (unified scene)
 * 2. Side-by-side composite (separate renders, FFmpeg blend)
 * 3. Shared coordinate system (both render to same canvas)
 */

import { D3VizEngine, VizData, VizOutput } from './d3-viz-engine.js';
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

// ============================================================================
// Types
// ============================================================================

interface UnifiedScene {
  d3Data?: VizData;
  manimScript?: string;
  layout: 'side-by-side' | 'overlay' | 'unified-manim';
  dimensions: {
    width: number;
    height: number;
  };
  duration: number;
}

interface UnifiedOutput {
  videoPath: string;
  duration: number;
  approach: string;
}

// ============================================================================
// Unified Renderer
// ============================================================================

export class UnifiedD3ManimRenderer {
  private outputDir: string;

  constructor(outputDir: string = 'output/unified') {
    this.outputDir = outputDir;
  }

  /**
   * Approach 1: Side-by-Side Composite
   * D3 on left, Manim on right, composited with FFmpeg
   */
  async renderSideBySide(scene: UnifiedScene): Promise<UnifiedOutput> {
    console.log('[Unified] Rendering side-by-side composite...');

    const tempDir = '/tmp/unified-render';
    await fs.mkdir(tempDir, { recursive: true });

    // 1. Render D3 visualization (left half)
    let d3Frames: Buffer[] = [];
    if (scene.d3Data) {
      const d3Engine = new D3VizEngine({
        width: scene.dimensions.width / 2,  // Half width
        height: scene.dimensions.height,
        animation: {
          enabled: true,
          duration: scene.duration,
          fps: 30,
          effects: ['draw']
        }
      });

      const d3Output = await d3Engine.visualize(scene.d3Data);
      d3Frames = d3Output.frames;

      // Save D3 video
      const d3VideoPath = path.join(tempDir, 'd3-left.mp4');
      await d3Engine.framesToVideo(d3Frames, d3VideoPath);
    }

    // 2. Render Manim animation (right half)
    let manimVideoPath: string | null = null;
    if (scene.manimScript) {
      manimVideoPath = await this.renderManim(scene.manimScript, {
        width: scene.dimensions.width / 2,  // Half width
        height: scene.dimensions.height
      });
    }

    // 3. Composite both videos side-by-side with FFmpeg
    const outputPath = path.join(this.outputDir, 'unified-side-by-side.mp4');
    await fs.mkdir(this.outputDir, { recursive: true });

    const d3Input = path.join(tempDir, 'd3-left.mp4');
    const manimInput = manimVideoPath || d3Input;  // Use D3 if no Manim

    // FFmpeg side-by-side filter
    const ffmpegCmd = `ffmpeg -i ${d3Input} -i ${manimInput} \
      -filter_complex "[0:v][1:v]hstack=inputs=2[v]" \
      -map "[v]" -c:v libx264 -pix_fmt yuv420p -y ${outputPath}`;

    execSync(ffmpegCmd);

    console.log(`✅ Unified video (side-by-side): ${outputPath}`);

    return {
      videoPath: outputPath,
      duration: scene.duration,
      approach: 'side-by-side'
    };
  }

  /**
   * Approach 2: Overlay Composite
   * D3 as background, Manim overlaid on top (or vice versa)
   */
  async renderOverlay(scene: UnifiedScene, d3Position: 'background' | 'foreground' = 'background'): Promise<UnifiedOutput> {
    console.log('[Unified] Rendering overlay composite...');

    const tempDir = '/tmp/unified-render';
    await fs.mkdir(tempDir, { recursive: true });

    // 1. Render D3 (full size)
    let d3VideoPath: string | null = null;
    if (scene.d3Data) {
      const d3Engine = new D3VizEngine({
        width: scene.dimensions.width,
        height: scene.dimensions.height,
        style: {
          aesthetic: 'hand-drawn',
          backgroundColor: d3Position === 'background' ? '#000000' : 'transparent',  // Transparent if foreground
          colors: {
            primary: '#ffffff',
            secondary: '#1e88e5',
            accent: '#4caf50',
            text: '#ffffff',
            highlight: '#ffeb3b'
          },
          fonts: {
            primary: 'Arial, sans-serif',
            handwriting: 'Caveat, cursive'
          },
          strokeWidth: 3,
          roughness: 1.5
        },
        animation: {
          enabled: true,
          duration: scene.duration,
          fps: 30,
          effects: ['draw']
        }
      });

      const d3Output = await d3Engine.visualize(scene.d3Data);
      d3VideoPath = path.join(tempDir, 'd3.mp4');
      await d3Engine.framesToVideo(d3Output.frames, d3VideoPath);
    }

    // 2. Render Manim (full size)
    let manimVideoPath: string | null = null;
    if (scene.manimScript) {
      manimVideoPath = await this.renderManim(scene.manimScript, {
        width: scene.dimensions.width,
        height: scene.dimensions.height
      });
    }

    // 3. Overlay with FFmpeg
    const outputPath = path.join(this.outputDir, 'unified-overlay.mp4');
    await fs.mkdir(this.outputDir, { recursive: true });

    if (d3VideoPath && manimVideoPath) {
      const bgVideo = d3Position === 'background' ? d3VideoPath : manimVideoPath;
      const fgVideo = d3Position === 'background' ? manimVideoPath : d3VideoPath;

      // FFmpeg overlay filter
      const ffmpegCmd = `ffmpeg -i ${bgVideo} -i ${fgVideo} \
        -filter_complex "[0:v][1:v]overlay=0:0[v]" \
        -map "[v]" -c:v libx264 -pix_fmt yuv420p -y ${outputPath}`;

      execSync(ffmpegCmd);
    }

    console.log(`✅ Unified video (overlay): ${outputPath}`);

    return {
      videoPath: outputPath,
      duration: scene.duration,
      approach: 'overlay'
    };
  }

  /**
   * Approach 3: Unified Manim Scene
   * Convert D3 SVG output to Manim objects, render in single Manim scene
   */
  async renderUnifiedManim(scene: UnifiedScene): Promise<UnifiedOutput> {
    console.log('[Unified] Rendering unified Manim scene with D3 SVG...');

    const tempDir = '/tmp/unified-render';
    await fs.mkdir(tempDir, { recursive: true });

    // 1. Generate D3 SVG (single frame, no animation)
    let d3SvgPath: string | null = null;
    if (scene.d3Data) {
      const d3Engine = new D3VizEngine({
        width: scene.dimensions.width,
        height: scene.dimensions.height,
        animation: {
          enabled: false,  // Single frame for SVG export
          duration: 0,
          fps: 30,
          effects: []
        }
      });

      // Generate single SVG frame
      const d3Output = await d3Engine.visualize(scene.d3Data);

      // Export first frame as SVG (we need to modify D3VizEngine to export SVG)
      // For now, we'll use a workaround
      d3SvgPath = path.join(tempDir, 'd3-viz.svg');
      // TODO: Add SVG export to D3VizEngine
    }

    // 2. Generate unified Manim script that imports D3 SVG
    const manimScript = this.generateUnifiedManimScript(
      scene.manimScript || '',
      d3SvgPath,
      scene.dimensions
    );

    // 3. Render with Manim
    const scriptPath = path.join(tempDir, 'unified_scene.py');
    await fs.writeFile(scriptPath, manimScript);

    const outputPath = await this.renderManimScript(scriptPath);

    console.log(`✅ Unified video (Manim + D3): ${outputPath}`);

    return {
      videoPath: outputPath,
      duration: scene.duration,
      approach: 'unified-manim'
    };
  }

  /**
   * Generate Manim script that includes D3 SVG
   */
  private generateUnifiedManimScript(
    manimCode: string,
    d3SvgPath: string | null,
    dimensions: { width: number; height: number }
  ): string {
    return `
from manim import *

class UnifiedScene(Scene):
    def construct(self):
        # Black background (shared blackboard)
        self.camera.background_color = "#000000"

        ${d3SvgPath ? `
        # Import D3 SVG visualization
        d3_viz = SVGMobject("${d3SvgPath}")
        d3_viz.scale(0.8)  # Scale to fit
        d3_viz.to_edge(LEFT)  # Position on left side

        # Animate D3 viz appearing
        self.play(Create(d3_viz), run_time=2)
        self.wait(0.5)
        ` : ''}

        ${manimCode ? `
        # Custom Manim animations
        ${manimCode}
        ` : `
        # Default: Show equation on right side
        equation = MathTex(r"\\pi = 3.14159265358979...")
        equation.scale(1.2)
        equation.to_edge(RIGHT)

        self.play(Write(equation), run_time=2)
        self.wait(1)
        `}

        # Final wait
        self.wait(2)
`;
  }

  /**
   * Render Manim script
   */
  private async renderManimScript(scriptPath: string): Promise<string> {
    const outputDir = path.dirname(scriptPath);
    const scriptName = path.basename(scriptPath, '.py');

    // Run Manim
    const cmd = `cd ${outputDir} && manim -pql ${scriptPath} UnifiedScene`;
    execSync(cmd, { stdio: 'inherit' });

    // Find output video
    const videoPath = path.join(outputDir, 'media', 'videos', scriptName, '480p15', 'UnifiedScene.mp4');

    // Copy to output directory
    const finalPath = path.join(this.outputDir, 'unified-manim.mp4');
    await fs.mkdir(this.outputDir, { recursive: true });
    await fs.copyFile(videoPath, finalPath);

    return finalPath;
  }

  /**
   * Helper: Render Manim with custom dimensions
   */
  private async renderManim(
    script: string,
    dimensions: { width: number; height: number }
  ): Promise<string> {
    const tempDir = '/tmp/manim-render';
    await fs.mkdir(tempDir, { recursive: true });

    const scriptPath = path.join(tempDir, 'scene.py');
    await fs.writeFile(scriptPath, script);

    // Render with Manim
    const cmd = `cd ${tempDir} && manim -pql --resolution ${dimensions.width},${dimensions.height} ${scriptPath}`;
    execSync(cmd);

    // Return path to rendered video
    const videoPath = path.join(tempDir, 'media/videos/scene/480p15/Scene.mp4');
    return videoPath;
  }

  /**
   * Smart renderer: Choose best approach based on scene
   */
  async renderSmart(scene: UnifiedScene): Promise<UnifiedOutput> {
    if (scene.layout === 'side-by-side') {
      return this.renderSideBySide(scene);
    } else if (scene.layout === 'overlay') {
      return this.renderOverlay(scene);
    } else {
      return this.renderUnifiedManim(scene);
    }
  }
}
