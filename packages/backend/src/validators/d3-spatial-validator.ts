/**
 * D3 Spatial Validator
 *
 * Validates D3 visualization data against spatial constraints
 * - Checks element counts
 * - Validates label lengths
 * - Detects collisions before render
 * - Auto-fixes common issues
 */

import { VizData, NetworkData, ComparisonData } from '../services/d3-viz-engine.js';
import {
  CANVAS,
  ZONES,
  FONTS,
  ELEMENT_CONSTRAINTS,
  VALIDATION,
  getLayoutConfig,
  getSafeBounds,
  truncateText,
  estimateTextWidth,
  clamp,
  type LayoutMode
} from '../config/spatial-config.js';

// ============================================================================
// Types
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  autoFixed: boolean;
}

export interface SimulatedNode {
  id: string;
  x: number;
  y: number;
  size: number;
  label: string;
  labelWidth: number;
  labelHeight: number;
}

export interface CollisionResult {
  hasCollisions: boolean;
  collisions: Array<{
    node1: string;
    node2: string;
    distance: number;
    minDistance: number;
  }>;
}

// ============================================================================
// D3 Spatial Validator Class
// ============================================================================

export class D3SpatialValidator {
  private layoutMode: LayoutMode;
  private layoutConfig: any;

  constructor(layoutMode: LayoutMode = 'full') {
    this.layoutMode = layoutMode;
    this.layoutConfig = getLayoutConfig(layoutMode);
  }

  /**
   * Main validation method
   */
  validate(vizData: VizData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Validate structure
    const structureCheck = this.validateStructure(vizData);
    errors.push(...structureCheck.errors);
    warnings.push(...structureCheck.warnings);

    // 2. Validate element counts
    const countCheck = this.validateElementCounts(vizData);
    errors.push(...countCheck.errors);
    warnings.push(...countCheck.warnings);

    // 3. Validate label lengths
    const labelCheck = this.validateLabels(vizData);
    errors.push(...labelCheck.errors);
    warnings.push(...labelCheck.warnings);

    // 4. Validate node sizes
    const sizeCheck = this.validateSizes(vizData);
    errors.push(...sizeCheck.errors);
    warnings.push(...sizeCheck.warnings);

    // 5. Simulate layout and check for collisions
    if (vizData.type === 'network' && vizData.nodes) {
      const collisionCheck = this.predictCollisions(vizData as NetworkData);
      if (collisionCheck.hasCollisions) {
        warnings.push(
          `Predicted ${collisionCheck.collisions.length} potential collision(s)`
        );
        collisionCheck.collisions.slice(0, 3).forEach(c => {
          warnings.push(
            `  • Nodes "${c.node1}" and "${c.node2}" may overlap (distance: ${c.distance.toFixed(0)}px, min: ${c.minDistance.toFixed(0)}px)`
          );
        });
      }
    }

    return {
      valid: errors.length === 0 && warnings.length <= VALIDATION.maxWarnings,
      errors,
      warnings,
      autoFixed: false
    };
  }

  /**
   * Auto-fix common spatial issues
   */
  autoFix(vizData: VizData): VizData {
    let fixed = { ...vizData };

    // 1. Fix element counts
    fixed = this.fixElementCounts(fixed);

    // 2. Fix label lengths
    fixed = this.fixLabels(fixed);

    // 3. Fix node sizes
    fixed = this.fixSizes(fixed);

    return fixed;
  }

  // ==========================================================================
  // VALIDATION METHODS
  // ==========================================================================

  private validateStructure(vizData: VizData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!vizData.type) {
      errors.push('Missing visualization type');
    }

    if (vizData.type === 'network') {
      const networkData = vizData as NetworkData;
      if (!networkData.nodes || networkData.nodes.length === 0) {
        errors.push('Network graph must have at least 1 node');
      }
    }

    if (vizData.type === 'comparison') {
      const comparisonData = vizData as ComparisonData;
      if (!comparisonData.groups || comparisonData.groups.length === 0) {
        errors.push('Comparison must have at least 1 group');
      }
    }

    return { valid: errors.length === 0, errors, warnings, autoFixed: false };
  }

  private validateElementCounts(vizData: VizData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (vizData.type === 'network' && vizData.nodes) {
      const maxNodes = this.getMaxNodes();
      const nodeCount = vizData.nodes.length;

      if (nodeCount > maxNodes) {
        errors.push(
          `Too many nodes: ${nodeCount} (max for ${this.layoutMode}: ${maxNodes})`
        );
      }

      if (nodeCount > maxNodes * 0.8) {
        warnings.push(
          `Node count (${nodeCount}) approaching limit (${maxNodes}). Consider simplifying.`
        );
      }
    }

    return { valid: errors.length === 0, errors, warnings, autoFixed: false };
  }

  private validateLabels(vizData: VizData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const maxChars = this.getMaxLabelChars();

    if (vizData.type === 'network' && vizData.nodes) {
      vizData.nodes.forEach((node, i) => {
        if (!node.label) {
          warnings.push(`Node ${i} has no label`);
          return;
        }

        const labelLength = node.label.length;

        if (labelLength > maxChars) {
          warnings.push(
            `Node ${i} label too long: "${node.label}" (${labelLength} chars, max ${maxChars})`
          );
        }

        // Check estimated width
        const estimatedWidth = estimateTextWidth(node.label, FONTS.sizes.label);
        if (estimatedWidth > ELEMENT_CONSTRAINTS.label.maxWidth) {
          warnings.push(
            `Node ${i} label "${node.label}" may be too wide (estimated ${estimatedWidth.toFixed(0)}px)`
          );
        }
      });
    }

    return { valid: errors.length === 0, errors, warnings, autoFixed: false };
  }

  private validateSizes(vizData: VizData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (vizData.type === 'network' && vizData.nodes) {
      vizData.nodes.forEach((node, i) => {
        if (node.size !== undefined) {
          if (node.size < ELEMENT_CONSTRAINTS.node.min) {
            warnings.push(
              `Node ${i} size ${node.size} below minimum (${ELEMENT_CONSTRAINTS.node.min})`
            );
          }

          if (node.size > ELEMENT_CONSTRAINTS.node.max) {
            warnings.push(
              `Node ${i} size ${node.size} above maximum (${ELEMENT_CONSTRAINTS.node.max})`
            );
          }
        }
      });
    }

    return { valid: errors.length === 0, errors, warnings, autoFixed: false };
  }

  // ==========================================================================
  // COLLISION DETECTION
  // ==========================================================================

  /**
   * Predict collisions by simulating layout
   */
  predictCollisions(networkData: NetworkData): CollisionResult {
    if (!networkData.nodes || networkData.nodes.length < 2) {
      return { hasCollisions: false, collisions: [] };
    }

    // Simulate simple force-directed layout
    const simulated = this.simulateLayout(networkData);

    // Check for collisions
    return this.detectCollisions(simulated);
  }

  /**
   * Simulate force-directed layout (simplified)
   */
  private simulateLayout(networkData: NetworkData): SimulatedNode[] {
    const nodes = networkData.nodes!;
    const bounds = getSafeBounds(this.layoutMode);
    const centerX = (bounds.x.min + bounds.x.max) / 2;
    const centerY = (bounds.y.min + bounds.y.max) / 2;

    // Start with circular arrangement
    const angleStep = (2 * Math.PI) / nodes.length;
    const radius = Math.min(
      (bounds.x.max - bounds.x.min) * 0.3,
      (bounds.y.max - bounds.y.min) * 0.3
    );

    return nodes.map((node, i) => {
      const angle = i * angleStep;
      const size = node.size || ELEMENT_CONSTRAINTS.node.default;

      return {
        id: node.id,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        size,
        label: node.label || '',
        labelWidth: estimateTextWidth(node.label || '', FONTS.sizes.label),
        labelHeight: FONTS.sizes.label * FONTS.lineHeights.normal
      };
    });
  }

  /**
   * Detect collisions between nodes
   */
  private detectCollisions(nodes: SimulatedNode[]): CollisionResult {
    const collisions: CollisionResult['collisions'] = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = this.calculateDistance(nodes[i], nodes[j]);
        const minDistance = nodes[i].size + nodes[j].size +
                           ELEMENT_CONSTRAINTS.node.padding +
                           VALIDATION.collisionBuffer;

        if (distance < minDistance) {
          collisions.push({
            node1: nodes[i].label || nodes[i].id,
            node2: nodes[j].label || nodes[j].id,
            distance,
            minDistance
          });
        }
      }
    }

    return {
      hasCollisions: collisions.length > 0,
      collisions
    };
  }

  /**
   * Calculate distance between two nodes
   */
  private calculateDistance(node1: SimulatedNode, node2: SimulatedNode): number {
    const dx = node1.x - node2.x;
    const dy = node1.y - node2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // ==========================================================================
  // AUTO-FIX METHODS
  // ==========================================================================

  private fixElementCounts(vizData: VizData): VizData {
    const fixed = { ...vizData };

    if (vizData.type === 'network' && vizData.nodes) {
      const maxNodes = this.getMaxNodes();

      if (vizData.nodes.length > maxNodes) {
        console.warn(
          `[SpatialValidator] Reducing nodes from ${vizData.nodes.length} to ${maxNodes}`
        );
        fixed.nodes = vizData.nodes.slice(0, maxNodes);

        // Also filter links to only include remaining nodes
        if (vizData.links) {
          const nodeIds = new Set(fixed.nodes!.map(n => n.id));
          fixed.links = vizData.links.filter(
            link => nodeIds.has(link.source) && nodeIds.has(link.target)
          );
        }
      }
    }

    return fixed;
  }

  private fixLabels(vizData: VizData): VizData {
    const fixed = { ...vizData };
    const maxChars = this.getMaxLabelChars();

    if (vizData.type === 'network' && vizData.nodes) {
      fixed.nodes = vizData.nodes.map(node => ({
        ...node,
        label: node.label ? truncateText(node.label, maxChars) : node.label
      }));
    }

    if (vizData.type === 'comparison' && vizData.groups) {
      fixed.groups = vizData.groups.map(group => ({
        ...group,
        name: truncateText(group.name, maxChars + 5),  // Groups can be slightly longer
        items: group.items.map(item => truncateText(item, maxChars))
      }));
    }

    return fixed;
  }

  private fixSizes(vizData: VizData): VizData {
    const fixed = { ...vizData };

    if (vizData.type === 'network' && vizData.nodes) {
      fixed.nodes = vizData.nodes.map(node => ({
        ...node,
        size: node.size !== undefined
          ? clamp(node.size, ELEMENT_CONSTRAINTS.node.min, ELEMENT_CONSTRAINTS.node.max)
          : ELEMENT_CONSTRAINTS.node.default
      }));
    }

    return fixed;
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  private getMaxNodes(): number {
    if (this.layoutMode === 'full') {
      return this.layoutConfig.d3.maxNodes;
    } else if (this.layoutMode === 'split') {
      return this.layoutConfig.d3.maxNodes;
    } else if (this.layoutMode === 'stepByStep') {
      return this.layoutConfig.maxNodesPerStep;
    } else if (this.layoutMode === 'grid') {
      return this.layoutConfig.maxNodesPerCell;
    }
    return 10; // Fallback
  }

  private getMaxLabelChars(): number {
    if (this.layoutMode === 'full') {
      return this.layoutConfig.d3.maxLabelChars;
    } else if (this.layoutMode === 'split') {
      return this.layoutConfig.d3.maxLabelChars;
    } else if (this.layoutMode === 'stepByStep') {
      return this.layoutConfig.maxLabelChars;
    } else if (this.layoutMode === 'grid') {
      return this.layoutConfig.maxLabelChars;
    }
    return 20; // Fallback
  }

  /**
   * Get validation summary report
   */
  getValidationReport(vizData: VizData): string {
    const result = this.validate(vizData);

    let report = `Spatial Validation Report (${this.layoutMode} mode)\n`;
    report += `${'='.repeat(50)}\n\n`;

    if (result.valid) {
      report += `✅ VALID - No issues found\n`;
    } else {
      report += `❌ INVALID - ${result.errors.length} error(s), ${result.warnings.length} warning(s)\n`;
    }

    if (result.errors.length > 0) {
      report += `\nErrors:\n`;
      result.errors.forEach((error, i) => {
        report += `  ${i + 1}. ${error}\n`;
      });
    }

    if (result.warnings.length > 0) {
      report += `\nWarnings:\n`;
      result.warnings.forEach((warning, i) => {
        report += `  ${i + 1}. ${warning}\n`;
      });
    }

    return report;
  }
}

// ============================================================================
// STANDALONE VALIDATION FUNCTIONS
// ============================================================================

/**
 * Quick validation (auto-fixes if possible)
 */
export function validateAndFix(
  vizData: VizData,
  layoutMode: LayoutMode = 'full'
): { data: VizData; result: ValidationResult } {
  const validator = new D3SpatialValidator(layoutMode);

  // First try as-is
  let result = validator.validate(vizData);

  // If invalid, try auto-fix
  if (!result.valid && result.errors.length > 0) {
    const fixed = validator.autoFix(vizData);
    result = validator.validate(fixed);
    result.autoFixed = true;

    return { data: fixed, result };
  }

  return { data: vizData, result };
}

/**
 * Strict validation (no auto-fix)
 */
export function validateStrict(
  vizData: VizData,
  layoutMode: LayoutMode = 'full'
): ValidationResult {
  const validator = new D3SpatialValidator(layoutMode);
  return validator.validate(vizData);
}
