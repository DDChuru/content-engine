/**
 * TikTok Session Manager
 * Manages user sessions and voice cloning state
 */

export interface Session {
  id: string;
  voiceId?: string;
  voiceName?: string;
  createdAt: Date;
  lastActivity: Date;
  metadata?: {
    conversationCount?: number;
    totalDuration?: number;
    originalLanguage?: string;
  };
}

export interface SessionData {
  voiceId?: string;
  voiceName?: string;
  metadata?: Record<string, any>;
}

/**
 * In-memory session storage with automatic cleanup
 */
class SessionManager {
  private sessions: Map<string, Session>;
  private cleanupInterval: NodeJS.Timeout | null;
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
  private readonly CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour

  constructor() {
    this.sessions = new Map();
    this.cleanupInterval = null;
    this.startCleanup();
  }

  /**
   * Create or update a session
   */
  createSession(sessionId: string, data?: SessionData): Session {
    const existing = this.sessions.get(sessionId);

    const session: Session = {
      id: sessionId,
      voiceId: data?.voiceId || existing?.voiceId,
      voiceName: data?.voiceName || existing?.voiceName,
      createdAt: existing?.createdAt || new Date(),
      lastActivity: new Date(),
      metadata: {
        ...existing?.metadata,
        ...data?.metadata,
      },
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): Session | undefined {
    const session = this.sessions.get(sessionId);
    if (session) {
      // Update last activity
      session.lastActivity = new Date();
      this.sessions.set(sessionId, session);
    }
    return session;
  }

  /**
   * Update session data
   */
  updateSession(sessionId: string, data: Partial<SessionData>): Session | null {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }

    const updated: Session = {
      ...session,
      voiceId: data.voiceId !== undefined ? data.voiceId : session.voiceId,
      voiceName: data.voiceName !== undefined ? data.voiceName : session.voiceName,
      lastActivity: new Date(),
      metadata: {
        ...session.metadata,
        ...data.metadata,
      },
    };

    this.sessions.set(sessionId, updated);
    return updated;
  }

  /**
   * Set voice ID for a session
   */
  setVoiceId(sessionId: string, voiceId: string, voiceName?: string): Session {
    return this.createSession(sessionId, { voiceId, voiceName });
  }

  /**
   * Check if session has voice cloned
   */
  hasVoiceCloned(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    return !!session?.voiceId;
  }

  /**
   * Get voice ID for session
   */
  getVoiceId(sessionId: string): string | undefined {
    return this.sessions.get(sessionId)?.voiceId;
  }

  /**
   * Delete a session
   */
  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /**
   * Get all active sessions
   */
  getAllSessions(): Session[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Get session count
   */
  getSessionCount(): number {
    return this.sessions.size;
  }

  /**
   * Clean up expired sessions
   */
  private cleanupExpiredSessions(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      const age = now - session.lastActivity.getTime();
      if (age > this.SESSION_TIMEOUT) {
        this.sessions.delete(sessionId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[SessionManager] Cleaned up ${cleaned} expired sessions`);
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
      this.cleanupExpiredSessions();
    }, this.CLEANUP_INTERVAL);

    console.log('[SessionManager] Started automatic session cleanup');
  }

  /**
   * Stop automatic cleanup
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('[SessionManager] Stopped automatic session cleanup');
    }
  }

  /**
   * Clear all sessions
   */
  clear(): void {
    this.sessions.clear();
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();
