import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Film,
  BookOpen,
  Sparkles,
  FolderOpen,
  Terminal as TerminalIcon,
  Send,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Terminal, { TerminalRef } from './components/Terminal';
import { useClaudeContext, WorkspaceType, WorkspaceContext } from './hooks/useClaudeContext';
import VideoEditorFull from './components/workspaces/VideoEditorFull';
import EducationStudioFull from './components/workspaces/EducationStudioFull';
import FacelessCreator from './components/workspaces/FacelessCreator';
import MediaPool from './components/workspaces/MediaPool';

// Workspace configuration
const workspaces = [
  { id: 'video-editor' as WorkspaceType, name: 'Video Editor', icon: Film, color: 'workspace-video', shortcut: '1' },
  { id: 'education-studio' as WorkspaceType, name: 'Education', icon: BookOpen, color: 'workspace-education', shortcut: '2' },
  { id: 'faceless-creator' as WorkspaceType, name: 'Faceless', icon: Sparkles, color: 'workspace-faceless', shortcut: '3' },
  { id: 'media-pool' as WorkspaceType, name: 'Media', icon: FolderOpen, color: 'workspace-media', shortcut: '4' },
];

// Get project path from URL or default
const urlParams = new URLSearchParams(window.location.search);
const projectPath = urlParams.get('project') || '/home/dachu/Documents/projects/content-engine';

export default function App() {
  const terminalRef = useRef<TerminalRef>(null);
  const [terminalConnected, setTerminalConnected] = useState(false);
  const [terminalCollapsed, setTerminalCollapsed] = useState(false);
  const [terminalWidth, setTerminalWidth] = useState(480);
  const [contextMessage, setContextMessage] = useState('');

  const {
    contexts,
    activeWorkspace,
    setActiveWorkspace,
    updateContext,
    getFormattedContext,
  } = useClaudeContext();

  // Handle context updates from workspaces
  const handleContextUpdate = useCallback((context: WorkspaceContext) => {
    updateContext(context);
  }, [updateContext]);

  // Send context to Claude
  const handleSendContext = useCallback(() => {
    if (!terminalRef.current) return;

    const formatted = getFormattedContext();
    const message = contextMessage.trim();

    // Build the full message
    let fullMessage = '';
    if (message) {
      fullMessage = message + '\n\n' + formatted;
    } else {
      fullMessage = formatted;
    }

    // Send to terminal (which injects into Claude)
    terminalRef.current.writeln(fullMessage);
    setContextMessage('');
  }, [contextMessage, getFormattedContext]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + number to switch workspaces
      if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        if (workspaces[index]) {
          setActiveWorkspace(workspaces[index].id);
        }
      }

      // Cmd/Ctrl + \ to toggle terminal
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        setTerminalCollapsed(prev => !prev);
      }

      // Cmd/Ctrl + Enter to send context
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSendContext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveWorkspace, handleSendContext]);

  // Resize handler for terminal panel
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = terminalWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = startX - e.clientX;
      const newWidth = Math.max(300, Math.min(800, startWidth + delta));
      setTerminalWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [terminalWidth]);

  // Get current workspace's context
  const currentContext = contexts.get(activeWorkspace);

  return (
    <div className="h-screen flex flex-col bg-studio-bg text-studio-text overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-studio-border bg-studio-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-neon">
              <span className="font-display font-bold text-studio-bg text-sm">CE</span>
            </div>
            <div>
              <h1 className="font-display text-sm tracking-wider">
                CONTENT <span className="text-accent-primary">ENGINE</span>
              </h1>
              <p className="text-[9px] font-ui uppercase tracking-[0.2em] text-studio-muted">
                Studio
              </p>
            </div>
          </div>

          {/* Workspace Tabs */}
          <div className="flex items-center gap-1 ml-6">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => setActiveWorkspace(ws.id)}
                className={`workspace-tab workspace-${ws.id.split('-')[0]} flex items-center gap-2 ${
                  activeWorkspace === ws.id ? 'active text-white' : 'text-studio-muted hover:text-studio-text'
                }`}
                style={{ '--workspace-color': `var(--${ws.color})` } as React.CSSProperties}
              >
                <ws.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{ws.name}</span>
                <span className="text-[10px] opacity-50">{ws.shortcut}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Connection status */}
          <div className="flex items-center gap-2 px-3 py-1 bg-studio-card border border-studio-border rounded">
            <div className={`w-2 h-2 rounded-full ${terminalConnected ? 'bg-accent-primary shadow-neon' : 'bg-accent-red'}`} />
            <span className="text-xs font-ui uppercase tracking-wider text-studio-muted">
              {terminalConnected ? 'Claude Connected' : 'Disconnected'}
            </span>
          </div>

          <button className="p-2 text-studio-muted hover:text-studio-text hover:bg-studio-card rounded transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex min-h-0">
        {/* Workspace Area */}
        <div className="flex-1 min-w-0">
          {activeWorkspace === 'video-editor' && <VideoEditorFull onContextUpdate={handleContextUpdate} />}
          {activeWorkspace === 'education-studio' && <EducationStudioFull onContextUpdate={handleContextUpdate} />}
          {activeWorkspace === 'faceless-creator' && <FacelessCreator onContextUpdate={handleContextUpdate} />}
          {activeWorkspace === 'media-pool' && <MediaPool onContextUpdate={handleContextUpdate} />}
        </div>

        {/* Terminal Panel */}
        <div
          className={`flex flex-col border-l border-studio-border bg-studio-card/30 transition-all ${
            terminalCollapsed ? 'w-12' : ''
          }`}
          style={{ width: terminalCollapsed ? undefined : `${terminalWidth}px` }}
        >
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-studio-border bg-studio-card/50">
            {!terminalCollapsed && (
              <>
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-4 h-4 text-accent-primary" />
                  <span className="font-ui text-xs uppercase tracking-wider text-studio-text">Claude</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setTerminalCollapsed(true)}
                    className="p-1 text-studio-muted hover:text-studio-text hover:bg-studio-card rounded"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
            {terminalCollapsed && (
              <button
                onClick={() => setTerminalCollapsed(false)}
                className="p-1 text-studio-muted hover:text-studio-text mx-auto"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {!terminalCollapsed && (
            <>
              {/* Resize handle */}
              <div
                onMouseDown={handleMouseDown}
                className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-accent-primary/50 transition-colors"
              />

              {/* Terminal */}
              <div className="flex-1 min-h-0 p-2">
                <Terminal
                  ref={terminalRef}
                  sessionId="main"
                  projectPath={projectPath}
                  onConnectionChange={setTerminalConnected}
                />
              </div>

              {/* Context Panel */}
              <div className="border-t border-studio-border">
                {/* Current context summary */}
                <div className="px-3 py-2 bg-studio-bg/50">
                  <div className="text-[10px] font-ui uppercase tracking-wider text-studio-muted mb-1">
                    Context from {activeWorkspace.replace('-', ' ')}
                  </div>
                  {currentContext?.activeItem ? (
                    <div className="flex items-center gap-2">
                      <span className="context-badge bg-accent-primary/20 text-accent-primary border border-accent-primary/30">
                        {currentContext.activeItem.name}
                      </span>
                      <span className="text-xs text-studio-muted">({currentContext.activeItem.type})</span>
                    </div>
                  ) : (
                    <span className="text-xs text-studio-muted">No selection</span>
                  )}
                  {currentContext?.inPoint !== undefined && currentContext?.outPoint !== undefined && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="context-badge bg-green-900/50 text-green-400 border border-green-700">
                        I: {currentContext.inPoint}
                      </span>
                      <span className="context-badge bg-yellow-900/50 text-yellow-400 border border-yellow-700">
                        O: {currentContext.outPoint}
                      </span>
                    </div>
                  )}
                </div>

                {/* Send context input */}
                <div className="px-3 py-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={contextMessage}
                    onChange={(e) => setContextMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendContext()}
                    placeholder="Message with context..."
                    className="flex-1 px-3 py-1.5 bg-studio-bg border border-studio-border rounded text-sm text-studio-text focus:outline-none focus:border-accent-primary"
                  />
                  <button
                    onClick={handleSendContext}
                    disabled={!terminalConnected}
                    className="p-2 bg-accent-primary text-studio-bg rounded hover:shadow-neon transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Status Bar */}
      <footer className="flex items-center justify-between px-4 py-1 border-t border-studio-border bg-studio-card/30 text-xs font-mono text-studio-muted">
        <div className="flex items-center gap-4">
          <span>
            <span className="text-accent-primary">◉</span> Content Engine Studio v1.0
          </span>
          <span>
            Project: <span className="text-accent-secondary">{projectPath.split('/').slice(-2).join('/')}</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>⌘1-4: Switch workspace</span>
          <span>⌘\: Toggle terminal</span>
          <span>⌘↵: Send context</span>
        </div>
      </footer>
    </div>
  );
}
