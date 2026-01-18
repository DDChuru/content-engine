/**
 * Type declarations for Studio Bridge Agent
 */

import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';

export class StudioBridgeAgent {
  httpServer: HttpServer;
  io: IOServer | null;
  watcher: any;
  changeRequestsFile: string;
  changeResponsesFile: string;
  pendingChanges: any[];

  constructor(httpServer: HttpServer);

  start(): Promise<void>;
  stop(): Promise<void>;

  initializeFiles(): Promise<void>;
  setupWebSocket(): void;
  watchChangeRequests(): void;
  handleIncomingChange(change: any): Promise<void>;
  processChangeRequests(): Promise<void>;
  generateClaudeCodeInstructions(requests: any[]): string;
  markChangesCompleted(completedIds: string[]): Promise<void>;
  refreshBrowser(): void;
}

export default StudioBridgeAgent;
