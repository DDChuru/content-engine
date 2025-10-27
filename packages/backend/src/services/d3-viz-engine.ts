/**
 * D3 Data-Driven Visualization Engine
 *
 * Custom visualization engine for data-driven documentation
 * No external API dependencies - full control over rendering
 *
 * Features:
 * - D3.js for data binding and layouts
 * - Hand-drawn/sketch aesthetic
 * - SVG rendering → PNG frames → video
 * - Multiple visualization types (network, flow, comparison, timeline)
 */

import * as d3 from 'd3';
import { JSDOM } from 'jsdom';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

// ============================================================================
// Types
// ============================================================================

export interface Point {
  x: number;
  y: number;
}

export interface VizConfig {
  width: number;
  height: number;
  style: VizStyle;
  animation?: AnimationConfig;
}

export interface VizStyle {
  aesthetic: 'hand-drawn' | 'chalk' | 'professional' | 'sketch-note';
  backgroundColor: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    highlight: string;
  };
  fonts: {
    primary: string;
    handwriting: string;
  };
  strokeWidth: number;
  roughness: number;  // 0-3, higher = more sketchy
}

export interface AnimationConfig {
  enabled: boolean;
  duration: number;  // seconds
  fps: number;
  effects: ('draw' | 'fade' | 'morph' | 'zoom')[];
}

export interface NetworkData {
  type: 'network';
  nodes: NetworkNode[];
  links: NetworkLink[];
}

export interface NetworkNode {
  id: string;
  label: string;
  group?: string;
  size?: number;
  x?: number;
  y?: number;
}

export interface NetworkLink {
  source: string | NetworkNode;
  target: string | NetworkNode;
  label?: string;
  strength?: number;
}

export interface ComparisonData {
  type: 'comparison';
  title: string;
  groups: ComparisonGroup[];
  relationships?: Relationship[];
  annotations?: Annotation[];
}

export interface ComparisonGroup {
  name: string;
  items: string[];
  metrics: Record<string, any>;
  visual: {
    type: 'molecule' | 'box' | 'list';
    style: 'sketchy' | 'solid';
  };
}

export interface Relationship {
  from: string;
  to: string;
  label: string;
  style: 'arrow' | 'line';
}

export interface Annotation {
  content: string;
  type: 'highlight' | 'note' | 'memorize';
  style?: string;
}

export type VizData = NetworkData | ComparisonData;

export interface VizOutput {
  frames: Buffer[];
  duration: number;
  fps: number;
  width: number;
  height: number;
}

// ============================================================================
// Main Engine
// ============================================================================

export class D3VizEngine {
  private dom: JSDOM;
  private config: VizConfig;

  constructor(config?: Partial<VizConfig>) {
    this.config = {
      width: 1920,
      height: 1080,
      style: {
        aesthetic: 'hand-drawn',
        backgroundColor: '#000000',
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
        strokeWidth: 2,
        roughness: 1.5
      },
      animation: {
        enabled: true,
        duration: 3,
        fps: 30,
        effects: ['draw']
      },
      ...config
    };

    this.dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  }

  /**
   * Generate visualization from data
   */
  async visualize(data: VizData): Promise<VizOutput> {
    console.log(`[D3VizEngine] Generating ${data.type} visualization...`);

    let frames: Buffer[];

    switch (data.type) {
      case 'network':
        frames = await this.renderNetworkGraph(data);
        break;
      case 'comparison':
        frames = await this.renderComparison(data);
        break;
      default:
        throw new Error(`Unknown visualization type: ${(data as any).type}`);
    }

    return {
      frames,
      duration: this.config.animation?.duration || 3,
      fps: this.config.animation?.fps || 30,
      width: this.config.width,
      height: this.config.height
    };
  }

  /**
   * Render network/graph visualization
   */
  private async renderNetworkGraph(data: NetworkData): Promise<Buffer[]> {
    const { width, height, style } = this.config;
    const svg = this.createSVG();

    // Create force simulation
    const simulation = d3.forceSimulation(data.nodes as any)
      .force('link', d3.forceLink(data.links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // CRITICAL: Run simulation to COMPLETE stabilization (not just 100 ticks)
    // Stop the simulation to prevent it from running in the background
    simulation.stop();

    // Run enough ticks to fully stabilize (300+ ensures complete settlement)
    // This happens BEFORE any rendering - invisible to the user
    console.log('[D3VizEngine] Stabilizing force simulation...');
    for (let i = 0; i < 300; i++) {
      simulation.tick();
    }
    console.log('[D3VizEngine] Force simulation complete - positions finalized');

    // Draw links
    const linkGroup = svg.append('g').attr('class', 'links');
    data.links.forEach(link => {
      const source = link.source as NetworkNode;
      const target = link.target as NetworkNode;

      const pathData = this.handDrawnPath(
        { x: source.x!, y: source.y! },
        { x: target.x!, y: target.y! }
      );

      linkGroup.append('path')
        .attr('d', pathData)
        .attr('stroke', style.colors.secondary)
        .attr('stroke-width', style.strokeWidth)
        .attr('fill', 'none')
        .attr('opacity', 0.7);
    });

    // Draw nodes
    const nodeGroup = svg.append('g').attr('class', 'nodes');
    data.nodes.forEach(node => {
      const circlePath = this.sketchyCircle(node.x!, node.y!, node.size || 30);

      nodeGroup.append('path')
        .attr('d', circlePath)
        .attr('fill', style.colors.accent)
        .attr('stroke', style.colors.primary)
        .attr('stroke-width', style.strokeWidth);

      // Add label
      nodeGroup.append('text')
        .attr('x', node.x!)
        .attr('y', node.y! + 5)
        .attr('text-anchor', 'middle')
        .attr('font-family', style.fonts.handwriting)
        .attr('font-size', 16)
        .attr('fill', style.colors.text)
        .text(node.label);
    });

    // Generate frames
    return this.generateFrames(svg);
  }

  /**
   * Render comparison visualization (like context window example)
   */
  private async renderComparison(data: ComparisonData): Promise<Buffer[]> {
    const { width, height, style } = this.config;
    const svg = this.createSVG();

    let xOffset = 100;
    const yOffset = 300;

    // Render each group
    for (const group of data.groups) {
      if (group.visual.type === 'molecule') {
        // Render as connected nodes (molecule structure)
        const centerX = xOffset + 100;
        const centerY = yOffset;
        const radius = 80;

        group.items.forEach((item, i) => {
          const angle = (i / group.items.length) * Math.PI * 2;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          // Node circle
          const circlePath = this.sketchyCircle(x, y, 25);
          svg.append('path')
            .attr('d', circlePath)
            .attr('fill', 'none')
            .attr('stroke', style.colors.primary)
            .attr('stroke-width', style.strokeWidth);

          // Label
          svg.append('text')
            .attr('x', x)
            .attr('y', y + 5)
            .attr('text-anchor', 'middle')
            .attr('font-family', style.fonts.handwriting)
            .attr('font-size', 14)
            .attr('fill', style.colors.text)
            .text(item);

          // Connect to center
          if (i < group.items.length - 1) {
            const nextAngle = ((i + 1) / group.items.length) * Math.PI * 2;
            const nextX = centerX + Math.cos(nextAngle) * radius;
            const nextY = centerY + Math.sin(nextAngle) * radius;

            svg.append('path')
              .attr('d', this.handDrawnPath({ x, y }, { x: nextX, y: nextY }))
              .attr('stroke', style.colors.primary)
              .attr('stroke-width', 1)
              .attr('fill', 'none')
              .attr('opacity', 0.5);
          }
        });

        // Group label
        svg.append('text')
          .attr('x', centerX)
          .attr('y', yOffset - 120)
          .attr('text-anchor', 'middle')
          .attr('font-family', style.fonts.handwriting)
          .attr('font-size', 18)
          .attr('fill', style.colors.highlight)
          .text(group.name);

        xOffset += 250;

      } else if (group.visual.type === 'box') {
        // Render as box
        const boxX = xOffset;
        const boxY = yOffset - 50;
        const boxW = 200;
        const boxH = 100;

        const rectPath = this.sketchyRectangle(boxX, boxY, boxW, boxH);
        svg.append('path')
          .attr('d', rectPath)
          .attr('fill', 'none')
          .attr('stroke', style.colors.secondary)
          .attr('stroke-width', style.strokeWidth + 1);

        // Group name
        svg.append('text')
          .attr('x', boxX + boxW / 2)
          .attr('y', boxY + 30)
          .attr('text-anchor', 'middle')
          .attr('font-family', style.fonts.handwriting)
          .attr('font-size', 18)
          .attr('fill', style.colors.secondary)
          .text(group.name);

        // Items
        group.items.forEach((item, i) => {
          svg.append('text')
            .attr('x', boxX + boxW / 2)
            .attr('y', boxY + 55 + i * 20)
            .attr('text-anchor', 'middle')
            .attr('font-family', style.fonts.handwriting)
            .attr('font-size', 14)
            .attr('fill', style.colors.text)
            .text(item);
        });

        xOffset += 250;
      }
    }

    // Render relationships (arrows)
    if (data.relationships) {
      data.relationships.forEach(rel => {
        // Find positions based on group names
        // For simplicity, use fixed positions
        const arrow = this.handDrawnArrow(
          { x: 350, y: yOffset },
          { x: 550, y: yOffset }
        );

        svg.append('path')
          .attr('d', arrow)
          .attr('stroke', style.colors.highlight)
          .attr('stroke-width', style.strokeWidth)
          .attr('fill', 'none');

        // Arrow label
        svg.append('text')
          .attr('x', 450)
          .attr('y', yOffset - 20)
          .attr('text-anchor', 'middle')
          .attr('font-family', style.fonts.handwriting)
          .attr('font-size', 14)
          .attr('fill', style.colors.highlight)
          .text(rel.label);
      });
    }

    // Render annotations
    if (data.annotations) {
      let annotY = 150;
      data.annotations.forEach(annot => {
        if (annot.type === 'highlight') {
          // Yellow highlight background
          const textWidth = annot.content.length * 10;
          svg.append('rect')
            .attr('x', width - textWidth - 100)
            .attr('y', annotY - 20)
            .attr('width', textWidth + 20)
            .attr('height', 35)
            .attr('fill', style.colors.highlight)
            .attr('opacity', 0.3)
            .attr('rx', 5);
        }

        svg.append('text')
          .attr('x', width - 400)
          .attr('y', annotY)
          .attr('font-family', style.fonts.handwriting)
          .attr('font-size', 16)
          .attr('fill', style.colors.text)
          .text(annot.content);

        annotY += 50;
      });
    }

    return this.generateFrames(svg);
  }

  /**
   * Create SVG element
   */
  private createSVG(): any {
    const { width, height, style } = this.config;
    const body = d3.select(this.dom.window.document.body);

    return body.append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .style('background', style.backgroundColor);
  }

  /**
   * Generate hand-drawn path between two points
   */
  private handDrawnPath(start: Point, end: Point): string {
    const points: Point[] = [];
    const segments = 8;
    const roughness = this.config.style.roughness;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = start.x + (end.x - start.x) * t + (Math.random() - 0.5) * roughness * 3;
      const y = start.y + (end.y - start.y) * t + (Math.random() - 0.5) * roughness * 3;
      points.push({ x, y });
    }

    return this.pointsToSmoothPath(points);
  }

  /**
   * Generate sketchy circle
   */
  private sketchyCircle(cx: number, cy: number, r: number): string {
    const points: Point[] = [];
    const segments = 24;
    const roughness = this.config.style.roughness;

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const wobble = (Math.random() - 0.5) * roughness * 2;
      const x = cx + Math.cos(angle) * (r + wobble);
      const y = cy + Math.sin(angle) * (r + wobble);
      points.push({ x, y });
    }

    return this.pointsToSmoothPath(points, true);
  }

  /**
   * Generate sketchy rectangle
   */
  private sketchyRectangle(x: number, y: number, w: number, h: number): string {
    const roughness = this.config.style.roughness;
    const corners = [
      { x: x + Math.random() * roughness, y: y + Math.random() * roughness },
      { x: x + w + Math.random() * roughness, y: y + Math.random() * roughness },
      { x: x + w + Math.random() * roughness, y: y + h + Math.random() * roughness },
      { x: x + Math.random() * roughness, y: y + h + Math.random() * roughness }
    ];

    return this.pointsToSmoothPath(corners, true);
  }

  /**
   * Generate hand-drawn arrow
   */
  private handDrawnArrow(start: Point, end: Point): string {
    const linePath = this.handDrawnPath(start, end);

    // Add arrowhead
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const arrowSize = 10;

    const arrowPoint1 = {
      x: end.x - arrowSize * Math.cos(angle - Math.PI / 6),
      y: end.y - arrowSize * Math.sin(angle - Math.PI / 6)
    };

    const arrowPoint2 = {
      x: end.x - arrowSize * Math.cos(angle + Math.PI / 6),
      y: end.y - arrowSize * Math.sin(angle + Math.PI / 6)
    };

    return `${linePath} M ${arrowPoint1.x},${arrowPoint1.y} L ${end.x},${end.y} L ${arrowPoint2.x},${arrowPoint2.y}`;
  }

  /**
   * Convert points to smooth path
   */
  private pointsToSmoothPath(points: Point[], closed: boolean = false): string {
    if (points.length < 2) return '';

    let path = `M ${points[0].x},${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1] || points[0];

      // Control points for smooth curve
      const cp1x = prev.x + (curr.x - prev.x) * 0.5;
      const cp1y = prev.y + (curr.y - prev.y) * 0.5;

      path += ` Q ${cp1x},${cp1y} ${curr.x},${curr.y}`;
    }

    if (closed) {
      path += ' Z';
    }

    return path;
  }

  /**
   * Generate animation frames
   */
  private async generateFrames(svg: any): Promise<Buffer[]> {
    const { animation } = this.config;

    if (!animation?.enabled) {
      // Single frame
      return [await this.svgToBuffer(svg)];
    }

    const frames: Buffer[] = [];
    const totalFrames = animation.duration * animation.fps;

    console.log(`[D3VizEngine] Generating ${totalFrames} frames...`);

    // Progressive reveal animation
    for (let frame = 0; frame < totalFrames; frame++) {
      const progress = frame / totalFrames;

      // Clone SVG and adjust opacity based on progress
      const svgClone = svg.clone(true);

      svgClone.selectAll('*').each(function(this: any, d: any, i: number) {
        const elementProgress = Math.max(0, Math.min(1, (progress - i * 0.05) * 2));
        d3.select(this).attr('opacity', elementProgress);
      });

      frames.push(await this.svgToBuffer(svgClone));
    }

    return frames;
  }

  /**
   * Convert SVG to PNG buffer
   */
  private async svgToBuffer(svg: any): Promise<Buffer> {
    const svgString = svg.node().outerHTML;

    // Use sharp to convert SVG to PNG
    return await sharp(Buffer.from(svgString))
      .png()
      .toBuffer();
  }

  /**
   * Export frames to video
   */
  async framesToVideo(frames: Buffer[], outputPath: string, audioPath?: string): Promise<string> {
    const { execSync } = await import('child_process');
    const tempDir = '/tmp/d3-viz-frames';

    // Create temp directory
    await fs.mkdir(tempDir, { recursive: true });

    // Write frames to disk
    for (let i = 0; i < frames.length; i++) {
      await fs.writeFile(
        path.join(tempDir, `frame_${String(i).padStart(5, '0')}.png`),
        frames[i]
      );
    }

    // Use FFmpeg to create video
    const fps = this.config.animation?.fps || 30;
    const ffmpegCmd = audioPath
      ? `ffmpeg -r ${fps} -i ${tempDir}/frame_%05d.png -i ${audioPath} -c:v libx264 -c:a aac -pix_fmt yuv420p -shortest -y ${outputPath}`
      : `ffmpeg -r ${fps} -i ${tempDir}/frame_%05d.png -c:v libx264 -pix_fmt yuv420p -y ${outputPath}`;

    execSync(ffmpegCmd);

    // Cleanup
    await fs.rm(tempDir, { recursive: true });

    return outputPath;
  }
}
