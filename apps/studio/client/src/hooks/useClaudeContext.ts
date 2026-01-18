import { useState, useEffect, useCallback, useRef } from 'react';

export type WorkspaceType = 'video-editor' | 'education-studio' | 'faceless-creator' | 'media-pool';

export interface WorkspaceContext {
  workspace: WorkspaceType;
  selection?: unknown;
  activeItem?: {
    id: string;
    name: string;
    type: string;
  };
  inPoint?: number;
  outPoint?: number;
  metadata?: Record<string, unknown>;
}

export interface UseClaudeContextReturn {
  contexts: Map<WorkspaceType, WorkspaceContext>;
  activeWorkspace: WorkspaceType;
  setActiveWorkspace: (workspace: WorkspaceType) => void;
  updateContext: (context: WorkspaceContext) => void;
  getFormattedContext: () => string;
  connected: boolean;
}

export function useClaudeContext(sessionId = 'default'): UseClaudeContextReturn {
  const [contexts, setContexts] = useState<Map<WorkspaceType, WorkspaceContext>>(new Map());
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType>('video-editor');
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Connect to context WebSocket
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws?type=context&session=${encodeURIComponent(sessionId)}`;

    const connect = () => {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[Context] WebSocket connected');
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === 'context_update' || message.type === 'context_sync') {
            setContexts(prev => {
              const next = new Map(prev);
              next.set(message.workspace as WorkspaceType, message.context);
              return next;
            });
          }
        } catch (err) {
          console.error('[Context] Parse error:', err);
        }
      };

      ws.onclose = () => {
        console.log('[Context] WebSocket closed');
        setConnected(false);
        // Reconnect after delay
        setTimeout(connect, 2000);
      };

      ws.onerror = (error) => {
        console.error('[Context] WebSocket error:', error);
      };
    };

    connect();

    return () => {
      wsRef.current?.close();
    };
  }, [sessionId]);

  // Update context and broadcast
  const updateContext = useCallback((context: WorkspaceContext) => {
    // Update local state
    setContexts(prev => {
      const next = new Map(prev);
      next.set(context.workspace, context);
      return next;
    });

    // Broadcast to server
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'update_context',
        context,
      }));
    }
  }, []);

  // Format all contexts for Claude prompt
  const getFormattedContext = useCallback((): string => {
    const lines: string[] = ['# Current Workspace Context\n'];

    contexts.forEach((ctx, workspace) => {
      lines.push(`## ${workspace}`);

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
  }, [contexts]);

  return {
    contexts,
    activeWorkspace,
    setActiveWorkspace,
    updateContext,
    getFormattedContext,
    connected,
  };
}
