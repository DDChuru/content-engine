import { WebSocket } from 'ws';
import { WorkspaceContext } from './pty-manager';

export interface ContextSubscriber {
  ws: WebSocket;
  workspaces: string[];
}

/**
 * Context Bridge - Syncs workspace state with Claude terminal
 *
 * Flow:
 * 1. Workspace (Video Editor, etc.) updates its state
 * 2. Client sends context update via WebSocket
 * 3. Context Bridge receives and broadcasts to subscribers
 * 4. Can optionally inject context into Claude terminal
 */
export class ContextBridge {
  private subscribers: Map<string, ContextSubscriber> = new Map();
  private currentContext: Map<string, WorkspaceContext> = new Map();
  private contextHistory: WorkspaceContext[] = [];
  private maxHistorySize = 100;

  constructor() {
    console.log('[ContextBridge] Initialized');
  }

  /** Subscribe a WebSocket to context updates */
  subscribe(id: string, ws: WebSocket, workspaces: string[] = ['*']): void {
    this.subscribers.set(id, { ws, workspaces });
    console.log(`[ContextBridge] Subscriber added: ${id}, workspaces: ${workspaces.join(', ')}`);

    // Send current context state to new subscriber
    this.currentContext.forEach((context, workspace) => {
      if (workspaces.includes('*') || workspaces.includes(workspace)) {
        this.sendToSubscriber(id, {
          type: 'context_sync',
          workspace,
          context,
        });
      }
    });
  }

  /** Unsubscribe a WebSocket */
  unsubscribe(id: string): void {
    this.subscribers.delete(id);
    console.log(`[ContextBridge] Subscriber removed: ${id}`);
  }

  /** Update context for a workspace */
  updateContext(context: WorkspaceContext): void {
    const workspace = context.workspace;
    this.currentContext.set(workspace, context);

    // Add to history
    this.contextHistory.push({ ...context, timestamp: Date.now() } as WorkspaceContext & { timestamp: number });
    if (this.contextHistory.length > this.maxHistorySize) {
      this.contextHistory.shift();
    }

    // Broadcast to subscribers
    this.broadcast({
      type: 'context_update',
      workspace,
      context,
    });

    console.log(`[ContextBridge] Context updated for ${workspace}`);
  }

  /** Get current context for a workspace */
  getContext(workspace: string): WorkspaceContext | undefined {
    return this.currentContext.get(workspace);
  }

  /** Get all current contexts */
  getAllContexts(): Map<string, WorkspaceContext> {
    return new Map(this.currentContext);
  }

  /** Get context history */
  getHistory(limit = 10): WorkspaceContext[] {
    return this.contextHistory.slice(-limit);
  }

  /** Format context for Claude prompt injection */
  formatForClaude(workspace?: string): string {
    const contexts = workspace
      ? [this.currentContext.get(workspace)].filter(Boolean)
      : Array.from(this.currentContext.values());

    if (contexts.length === 0) {
      return '# No active context\n';
    }

    const lines: string[] = ['# Current Workspace Context\n'];

    contexts.forEach(ctx => {
      if (!ctx) return;

      lines.push(`## ${ctx.workspace}`);

      if (ctx.activeItem) {
        lines.push(`- Active: ${ctx.activeItem.name} (${ctx.activeItem.type})`);
      }

      if (ctx.selection) {
        lines.push(`- Selection: ${JSON.stringify(ctx.selection)}`);
      }

      if (ctx.inPoint !== undefined && ctx.outPoint !== undefined) {
        lines.push(`- Range: frame ${ctx.inPoint} → ${ctx.outPoint}`);
      }

      if (ctx.metadata) {
        Object.entries(ctx.metadata).forEach(([key, value]) => {
          lines.push(`- ${key}: ${JSON.stringify(value)}`);
        });
      }

      lines.push('');
    });

    return lines.join('\n');
  }

  /** Broadcast message to all matching subscribers */
  private broadcast(message: unknown): void {
    const payload = JSON.stringify(message);

    this.subscribers.forEach((subscriber, id) => {
      const { ws, workspaces } = subscriber;
      const msgWorkspace = (message as { workspace?: string }).workspace;

      // Check if subscriber is interested in this workspace
      if (workspaces.includes('*') || (msgWorkspace && workspaces.includes(msgWorkspace))) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(payload);
        }
      }
    });
  }

  /** Send to specific subscriber */
  private sendToSubscriber(id: string, message: unknown): void {
    const subscriber = this.subscribers.get(id);
    if (subscriber && subscriber.ws.readyState === WebSocket.OPEN) {
      subscriber.ws.send(JSON.stringify(message));
    }
  }
}
