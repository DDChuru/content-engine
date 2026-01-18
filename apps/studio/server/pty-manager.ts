import pty, { IPty } from 'node-pty';
import os from 'os';
import fs from 'fs';
import path from 'path';

export interface PtyManagerOptions {
  cwd?: string;
  autoStartClaude?: boolean;
}

/**
 * Manages a PTY (pseudo-terminal) session for Claude Code
 * Forked and enhanced from ralph-dashboard
 */
export class PtyManager {
  private ptyProcess: IPty;
  private callbacks: ((data: string) => void)[] = [];
  private exitCallbacks: ((code: number, signal: number) => void)[] = [];
  private cwd: string;

  constructor(options: PtyManagerOptions = {}) {
    const { cwd = process.cwd(), autoStartClaude = false } = options;

    // Resolve and validate the working directory
    let resolvedCwd = cwd;

    if (!cwd || cwd === '' || cwd === 'undefined' || cwd === 'null') {
      resolvedCwd = process.cwd();
    } else if (!path.isAbsolute(cwd)) {
      resolvedCwd = path.resolve(process.env.HOME || '', cwd);
    }

    // Check if directory exists, fall back to home if not
    if (!fs.existsSync(resolvedCwd)) {
      console.warn(`[PTY] Directory does not exist: ${resolvedCwd}, falling back to home`);
      resolvedCwd = process.env.HOME || '/home';
    }

    this.cwd = resolvedCwd;

    // Determine shell
    const shell = os.platform() === 'win32'
      ? 'powershell.exe'
      : process.env.SHELL || '/bin/bash';

    console.log(`[PTY] Spawning shell in: ${this.cwd}`);

    // Spawn PTY
    this.ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-256color',
      cols: 120,
      rows: 30,
      cwd: this.cwd,
      env: {
        ...process.env,
        TERM: 'xterm-256color',
        COLORTERM: 'truecolor',
        PATH: process.env.PATH || '',
      } as Record<string, string>,
    });

    // Handle output
    this.ptyProcess.onData((data: string) => {
      this.callbacks.forEach(cb => cb(data));
    });

    this.ptyProcess.onExit(({ exitCode, signal }) => {
      console.log(`[PTY] Process exited with code ${exitCode}, signal ${signal}`);
      this.exitCallbacks.forEach(cb => cb(exitCode, signal));
    });

    console.log(`[PTY] Started in ${this.cwd} (PID: ${this.ptyProcess.pid})`);

    // Auto-start Claude if requested
    if (autoStartClaude) {
      setTimeout(() => this.startClaude(), 500);
    }
  }

  /** Register callback for data output */
  onData(callback: (data: string) => void): void {
    this.callbacks.push(callback);
  }

  /** Register callback for process exit */
  onExit(callback: (code: number, signal: number) => void): void {
    this.exitCallbacks.push(callback);
  }

  /** Write data to the PTY */
  write(data: string): void {
    this.ptyProcess.write(data);
  }

  /** Resize the PTY */
  resize(cols: number, rows: number): void {
    try {
      this.ptyProcess.resize(cols, rows);
    } catch (err) {
      console.error('[PTY] Resize error:', err);
    }
  }

  /** Kill the PTY process */
  kill(): void {
    try {
      this.ptyProcess.kill();
      console.log('[PTY] Process killed');
    } catch (err) {
      console.error('[PTY] Kill error:', err);
    }
  }

  /** Start Claude Code in the PTY */
  startClaude(): void {
    this.write('claude\r');
  }

  /** Execute a command */
  executeCommand(command: string): void {
    this.write(command + '\r');
  }

  /** Send context to Claude (formatted message) */
  sendContext(context: WorkspaceContext): void {
    // Format context as a user message to Claude
    const contextMessage = this.formatContextMessage(context);
    this.write(contextMessage);
  }

  /** Format workspace context as a Claude-friendly message */
  private formatContextMessage(context: WorkspaceContext): string {
    const lines: string[] = [];

    lines.push(`[Context from ${context.workspace}]`);

    if (context.selection) {
      lines.push(`Selection: ${JSON.stringify(context.selection)}`);
    }

    if (context.activeItem) {
      lines.push(`Active: ${context.activeItem.name} (${context.activeItem.type})`);
    }

    if (context.inPoint !== undefined && context.outPoint !== undefined) {
      lines.push(`Range: ${context.inPoint} → ${context.outPoint}`);
    }

    if (context.metadata) {
      lines.push(`Details: ${JSON.stringify(context.metadata)}`);
    }

    return lines.join('\n') + '\n';
  }

  get pid(): number {
    return this.ptyProcess.pid;
  }

  get workingDirectory(): string {
    return this.cwd;
  }
}

/** Workspace context that can be sent to Claude */
export interface WorkspaceContext {
  workspace: 'video-editor' | 'education-studio' | 'course-creator' | 'media-pool';
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
