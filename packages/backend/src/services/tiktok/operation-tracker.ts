/**
 * Operation Tracker
 * Tracks async batch rendering operations and their progress
 */

import { TikTokBatch } from './types.js';

export interface OperationProgress {
  current: number;
  total: number;
  percentage: number;
  currentTask?: string;
}

export interface Operation {
  id: string;
  type: 'batch-render' | 'analyze';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: OperationProgress;
  result?: TikTokBatch | any;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

/**
 * In-memory operation tracking with automatic cleanup
 */
class OperationTracker {
  private operations: Map<string, Operation>;
  private cleanupInterval: NodeJS.Timeout | null;
  private readonly OPERATION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours
  private readonly CLEANUP_INTERVAL = 15 * 60 * 1000; // 15 minutes

  constructor() {
    this.operations = new Map();
    this.cleanupInterval = null;
    this.startCleanup();
  }

  /**
   * Create a new operation
   */
  createOperation(
    operationId: string,
    type: Operation['type'],
    total: number
  ): Operation {
    const operation: Operation = {
      id: operationId,
      type,
      status: 'pending',
      progress: {
        current: 0,
        total,
        percentage: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.operations.set(operationId, operation);
    return operation;
  }

  /**
   * Get operation by ID
   */
  getOperation(operationId: string): Operation | undefined {
    return this.operations.get(operationId);
  }

  /**
   * Update operation progress
   */
  updateProgress(
    operationId: string,
    current: number,
    currentTask?: string
  ): boolean {
    const operation = this.operations.get(operationId);
    if (!operation) {
      return false;
    }

    operation.progress.current = current;
    operation.progress.percentage = Math.round(
      (current / operation.progress.total) * 100
    );
    operation.progress.currentTask = currentTask;
    operation.updatedAt = new Date();

    if (operation.status === 'pending') {
      operation.status = 'processing';
    }

    this.operations.set(operationId, operation);
    return true;
  }

  /**
   * Mark operation as completed
   */
  completeOperation(operationId: string, result: any): boolean {
    const operation = this.operations.get(operationId);
    if (!operation) {
      return false;
    }

    operation.status = 'completed';
    operation.result = result;
    operation.progress.current = operation.progress.total;
    operation.progress.percentage = 100;
    operation.updatedAt = new Date();
    operation.completedAt = new Date();

    this.operations.set(operationId, operation);
    return true;
  }

  /**
   * Mark operation as failed
   */
  failOperation(operationId: string, error: string): boolean {
    const operation = this.operations.get(operationId);
    if (!operation) {
      return false;
    }

    operation.status = 'failed';
    operation.error = error;
    operation.updatedAt = new Date();
    operation.completedAt = new Date();

    this.operations.set(operationId, operation);
    return true;
  }

  /**
   * Update operation status
   */
  updateStatus(
    operationId: string,
    status: Operation['status']
  ): boolean {
    const operation = this.operations.get(operationId);
    if (!operation) {
      return false;
    }

    operation.status = status;
    operation.updatedAt = new Date();

    if (status === 'completed' || status === 'failed') {
      operation.completedAt = new Date();
    }

    this.operations.set(operationId, operation);
    return true;
  }

  /**
   * Delete an operation
   */
  deleteOperation(operationId: string): boolean {
    return this.operations.delete(operationId);
  }

  /**
   * Get all operations
   */
  getAllOperations(): Operation[] {
    return Array.from(this.operations.values());
  }

  /**
   * Get operations by status
   */
  getOperationsByStatus(status: Operation['status']): Operation[] {
    return Array.from(this.operations.values()).filter(
      (op) => op.status === status
    );
  }

  /**
   * Clean up old completed/failed operations
   */
  private cleanupOldOperations(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [operationId, operation] of this.operations.entries()) {
      // Only clean up completed or failed operations
      if (operation.status === 'completed' || operation.status === 'failed') {
        const age = now - operation.updatedAt.getTime();
        if (age > this.OPERATION_TIMEOUT) {
          this.operations.delete(operationId);
          cleaned++;
        }
      }
    }

    if (cleaned > 0) {
      console.log(`[OperationTracker] Cleaned up ${cleaned} old operations`);
    }

    return cleaned;
  }

  /**
   * Start automatic cleanup
   */
  private startCleanup(): void {
    if (this.cleanupInterval) {
      return;
    }

    this.cleanupInterval = setInterval(() => {
      this.cleanupOldOperations();
    }, this.CLEANUP_INTERVAL);

    console.log('[OperationTracker] Started automatic operation cleanup');
  }

  /**
   * Stop automatic cleanup
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('[OperationTracker] Stopped automatic operation cleanup');
    }
  }

  /**
   * Clear all operations
   */
  clear(): void {
    this.operations.clear();
  }

  /**
   * Get operation count
   */
  getOperationCount(): number {
    return this.operations.size;
  }
}

// Export singleton instance
export const operationTracker = new OperationTracker();
