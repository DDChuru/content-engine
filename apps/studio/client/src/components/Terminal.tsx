import { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';

export interface TerminalRef {
  write: (text: string) => void;
  writeln: (text: string) => void;
  focus: () => void;
  scrollToBottom: () => void;
  refit: () => void;
  sendContext: () => void;
}

interface TerminalProps {
  sessionId?: string;
  projectPath?: string;
  onConnectionChange?: (connected: boolean) => void;
}

const Terminal = forwardRef<TerminalRef, TerminalProps>(function Terminal(
  { sessionId = 'default', projectPath, onConnectionChange },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  // Initialize xterm and WebSocket
  useEffect(() => {
    if (!containerRef.current) return;

    let isActive = true;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 10;

    const container = containerRef.current;

    // Create xterm instance with Content Engine theme
    const xterm = new XTerm({
      theme: {
        background: '#0a0a0f',
        foreground: '#e8e8f0',
        cursor: '#00ff88',
        cursorAccent: '#0a0a0f',
        selectionBackground: '#00ff8840',
        selectionForeground: '#ffffff',
        black: '#12121a',
        red: '#ff3366',
        green: '#00ff88',
        yellow: '#ff8800',
        blue: '#3b82f6',
        magenta: '#a78bfa',
        cyan: '#00f0ff',
        white: '#e8e8f0',
        brightBlack: '#3a3a4d',
        brightRed: '#ff6688',
        brightGreen: '#00ffaa',
        brightYellow: '#ffaa00',
        brightBlue: '#60a5fa',
        brightMagenta: '#c4b5fd',
        brightCyan: '#00ffff',
        brightWhite: '#ffffff',
      },
      fontFamily: 'IBM Plex Mono, JetBrains Mono, Menlo, Monaco, monospace',
      fontSize: 14,
      lineHeight: 1.3,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 10000,
      cols: 80,
      rows: 24,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    xterm.loadAddon(fitAddon);
    xterm.loadAddon(webLinksAddon);
    xterm.open(container);

    xtermRef.current = xterm;
    fitAddonRef.current = fitAddon;

    // Fit after delay
    setTimeout(() => {
      if (!isActive) return;
      try {
        fitAddon.fit();
      } catch (e) {
        console.warn('Fit failed:', e);
      }
    }, 100);

    // Connect WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws?type=terminal&session=${encodeURIComponent(sessionId)}&project=${encodeURIComponent(projectPath || '')}`;

    const connectWebSocket = () => {
      if (!isActive) return;

      console.log('[Terminal] Connecting to:', wsUrl);
      xterm.write('\r\n\x1b[38;5;246mConnecting to terminal...\x1b[0m\r\n');

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isActive) {
          ws.close();
          return;
        }
        console.log('[Terminal] WebSocket connected');
        reconnectAttempts = 0;
        onConnectionChange?.(true);
        xterm.write('\x1b[38;5;82mConnected!\x1b[0m\r\n\r\n');

        // Send initial size
        try {
          const dims = fitAddon.proposeDimensions();
          if (dims) {
            ws.send(JSON.stringify({ type: 'resize', cols: dims.cols, rows: dims.rows }));
          }
        } catch (e) {
          // Ignore
        }
      };

      ws.onmessage = (event) => {
        if (!isActive) return;
        xterm.write(event.data);
      };

      ws.onclose = (event) => {
        if (!isActive) return;
        console.log('[Terminal] WebSocket closed:', event.code, event.reason);
        onConnectionChange?.(false);

        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          const delay = Math.min(1000 * reconnectAttempts, 5000);
          xterm.write(`\r\n\x1b[38;5;214mDisconnected. Reconnecting in ${delay / 1000}s... (${reconnectAttempts}/${maxReconnectAttempts})\x1b[0m\r\n`);
          reconnectTimeout = setTimeout(connectWebSocket, delay);
        } else {
          xterm.write('\r\n\x1b[38;5;196mConnection failed. Please restart the studio server.\x1b[0m\r\n');
        }
      };

      ws.onerror = (error) => {
        console.error('[Terminal] WebSocket error:', error);
      };
    };

    connectWebSocket();

    // Handle terminal input
    const inputDisposable = xterm.onData((data) => {
      if (!isActive) return;
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(data);
      }
    });

    // Handle resize
    const handleResize = () => {
      if (!isActive) return;
      try {
        fitAddon.fit();
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const dims = fitAddon.proposeDimensions();
          if (dims) {
            wsRef.current.send(JSON.stringify({ type: 'resize', cols: dims.cols, rows: dims.rows }));
          }
        }
      } catch (e) {
        // Ignore
      }
    };

    window.addEventListener('resize', handleResize);

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    xterm.focus();

    // Cleanup
    return () => {
      isActive = false;
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      inputDisposable.dispose();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      wsRef.current?.close();
      xterm.dispose();
      xtermRef.current = null;
      wsRef.current = null;
      fitAddonRef.current = null;
    };
  }, [sessionId, projectPath, onConnectionChange]);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    write: (text: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(text);
      }
    },
    writeln: (text: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(text + '\r');
      }
    },
    focus: () => {
      xtermRef.current?.focus();
    },
    scrollToBottom: () => {
      xtermRef.current?.scrollToBottom();
    },
    refit: () => {
      if (fitAddonRef.current && xtermRef.current) {
        try {
          fitAddonRef.current.fit();
          xtermRef.current.scrollToBottom();
        } catch (e) {
          // Ignore
        }
      }
    },
    sendContext: () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'context' }));
      }
    },
  }), []);

  const handleContainerClick = useCallback(() => {
    xtermRef.current?.focus();
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="w-full h-full bg-studio-bg rounded-lg overflow-hidden cursor-text"
      style={{ minHeight: '200px' }}
    />
  );
});

export default Terminal;
