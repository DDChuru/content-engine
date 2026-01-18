/**
 * Studio Bridge Agent
 * Autonomous bridge between Studio UI and Claude Code
 *
 * Watches for changes from Studio UI → Triggers Claude Code workflow → Auto-refreshes browser
 */

import chokidar from 'chokidar';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../../..');

export class StudioBridgeAgent {
  constructor(httpServer) {
    this.httpServer = httpServer;
    this.io = null;
    this.watcher = null;

    // File paths
    this.changeRequestsFile = path.join(ROOT_DIR, 'studio-change-requests.json');
    this.changeResponsesFile = path.join(ROOT_DIR, 'studio-change-responses.json');
    this.pendingChanges = [];

    console.log('📡 Studio Bridge Agent initialized');
    console.log(`   Watch file: ${this.changeRequestsFile}`);
  }

  /**
   * Start the bridge agent
   */
  async start() {
    console.log('🚀 Starting Studio Bridge Agent...');

    // Initialize files
    await this.initializeFiles();

    // Setup WebSocket server for browser live reload
    this.setupWebSocket();

    // Watch for change requests from Studio UI
    this.watchChangeRequests();

    console.log('✅ Studio Bridge Agent running');
    console.log('   • File watcher active');
    console.log('   • WebSocket server ready');
    console.log('   • Waiting for Studio UI changes...');
  }

  /**
   * Initialize communication files
   */
  async initializeFiles() {
    const initialRequests = {
      instructions: "This file is managed by Studio UI. Changes are automatically detected by the bridge agent.",
      pendingRequests: [],
      completedRequests: []
    };

    const initialResponses = {
      instructions: "This file is managed by Claude Code. Responses are written here after processing changes.",
      responses: []
    };

    try {
      await fs.access(this.changeRequestsFile);
    } catch {
      await fs.writeFile(this.changeRequestsFile, JSON.stringify(initialRequests, null, 2));
      console.log('📝 Created studio-change-requests.json');
    }

    try {
      await fs.access(this.changeResponsesFile);
    } catch {
      await fs.writeFile(this.changeResponsesFile, JSON.stringify(initialResponses, null, 2));
      console.log('📝 Created studio-change-responses.json');
    }
  }

  /**
   * Setup WebSocket for live browser updates
   */
  setupWebSocket() {
    this.io = new Server(this.httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    this.io.on('connection', (socket) => {
      console.log('🔌 Studio UI connected via WebSocket');

      socket.on('disconnect', () => {
        console.log('🔌 Studio UI disconnected');
      });

      socket.on('studio-change', (change) => {
        console.log('📥 Received change from Studio UI:', change);
        this.handleIncomingChange(change);
      });
    });

    console.log('🌐 WebSocket server listening for Studio UI connections');
  }

  /**
   * Watch for changes to the requests file
   */
  watchChangeRequests() {
    this.watcher = chokidar.watch(this.changeRequestsFile, {
      persistent: true,
      ignoreInitial: true
    });

    this.watcher.on('change', async () => {
      console.log('🔔 Change detected in studio-change-requests.json');
      await this.processChangeRequests();
    });

    console.log('👁️  File watcher active on:', this.changeRequestsFile);
  }

  /**
   * Handle incoming change from WebSocket
   */
  async handleIncomingChange(change) {
    // Add timestamp and ID
    const changeRequest = {
      id: `req_${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
      ...change
    };

    // Save to file
    const data = JSON.parse(await fs.readFile(this.changeRequestsFile, 'utf-8'));
    data.pendingRequests.push(changeRequest);
    await fs.writeFile(this.changeRequestsFile, JSON.stringify(data, null, 2));

    console.log(`📝 Saved change request: ${changeRequest.id}`);
    console.log(`   Type: ${changeRequest.changeType}`);
    console.log(`   Step: ${changeRequest.step}`);

    // Immediately process
    await this.processChangeRequests();
  }

  /**
   * Process pending change requests
   */
  async processChangeRequests() {
    try {
      const data = JSON.parse(await fs.readFile(this.changeRequestsFile, 'utf-8'));
      const pending = data.pendingRequests || [];

      if (pending.length === 0) {
        return;
      }

      console.log(`\n📋 Processing ${pending.length} change request(s)...\n`);

      // Create instructions for Claude Code
      const instructions = this.generateClaudeCodeInstructions(pending);

      // Save instructions for Claude Code to read
      const instructionsFile = path.join(ROOT_DIR, 'CLAUDE-CODE-INSTRUCTIONS.md');
      await fs.writeFile(instructionsFile, instructions);

      console.log('✅ Instructions generated for Claude Code');
      console.log(`   File: ${instructionsFile}`);
      console.log('\n' + '='.repeat(60));
      console.log('📢 READY FOR CLAUDE CODE');
      console.log('='.repeat(60));
      console.log('\nNext steps:');
      console.log('1. Tell Claude Code: "Process studio change requests"');
      console.log('2. Claude Code will read the instructions and apply changes');
      console.log('3. Browser will auto-refresh when complete');
      console.log('\n' + '='.repeat(60) + '\n');

    } catch (error) {
      console.error('❌ Error processing changes:', error);
    }
  }

  /**
   * Generate clear instructions for Claude Code
   */
  generateClaudeCodeInstructions(requests) {
    let instructions = `# Studio Change Requests for Claude Code\n\n`;
    instructions += `**Generated:** ${new Date().toISOString()}\n`;
    instructions += `**Pending Requests:** ${requests.length}\n\n`;
    instructions += `---\n\n`;

    requests.forEach((req, index) => {
      instructions += `## Request ${index + 1}: ${req.changeType}\n\n`;
      instructions += `**ID:** ${req.id}\n`;
      instructions += `**Step/Scene:** ${req.step}\n`;

      // Include lesson context if available
      if (req.lessonId) {
        instructions += `**Lesson ID:** ${req.lessonId}\n`;
      }
      if (req.lessonTitle) {
        instructions += `**Lesson Title:** ${req.lessonTitle}\n`;
      }
      if (req.lessonPath) {
        instructions += `**Lesson Video Path:** ${req.lessonPath}\n`;
        // Derive the source files from the lesson path
        if (req.lessonPath.includes('manim')) {
          instructions += `**Source Files:**\n`;
          instructions += `  - Manim Python: \`packages/backend/src/manim/sets_lesson.py\`\n`;
          instructions += `  - Remotion Composition: \`packages/backend/src/remotion/compositions/SetsLesson.tsx\`\n`;
        }
      }
      instructions += `\n`;

      switch (req.changeType) {
        case 'narration':
          instructions += `**Action:** Update narration for ${req.step}\n\n`;
          if (req.newValue) {
            instructions += `**New narration:**\n`;
            instructions += `\`\`\`\n${req.newValue}\n\`\`\`\n\n`;
          } else {
            instructions += `**Details:** ${req.instruction}\n\n`;
          }
          break;

        case 'visual':
          instructions += `**Action:** Visual adjustment\n\n`;
          instructions += `**Details:** ${req.instruction}\n\n`;
          if (req.currentValue) {
            instructions += `**Current value:** ${req.currentValue}\n`;
          }
          if (req.suggestedValue) {
            instructions += `**Suggested value:** ${req.suggestedValue}\n`;
          }
          break;

        case 'animation':
          instructions += `**Action:** Animation timing adjustment\n\n`;
          instructions += `**Details:** ${req.instruction}\n\n`;
          break;

        case 'spacing':
          instructions += `**Action:** Adjust spacing/positioning\n\n`;
          instructions += `**Details:** ${req.instruction}\n\n`;
          break;

        case 'color':
          instructions += `**Action:** Change color\n\n`;
          if (req.element) {
            instructions += `**Element:** ${req.element}\n`;
          }
          if (req.newValue) {
            instructions += `**New color:** ${req.newValue}\n`;
          }
          instructions += `**Details:** ${req.instruction}\n\n`;
          break;

        case 'text':
          instructions += `**Action:** Update text content\n\n`;
          instructions += `**Details:** ${req.instruction}\n\n`;
          break;

        case 'layout':
          instructions += `**Action:** Layout change\n\n`;
          instructions += `**Details:** ${req.instruction}\n\n`;
          break;

        case 'timing':
          instructions += `**Action:** Adjust timing\n\n`;
          instructions += `**Details:** ${req.instruction}\n\n`;
          break;

        default:
          instructions += `**Action:** ${req.instruction}\n\n`;
      }

      instructions += `---\n\n`;
    });

    instructions += `## Instructions for Claude Code\n\n`;
    instructions += `1. Read each request above carefully\n`;
    instructions += `2. Identify the correct source files based on the lesson context:\n`;
    instructions += `   - For Manim lessons: Edit the Python file in \`packages/backend/src/manim/\`\n`;
    instructions += `   - For Remotion lessons: Edit the TSX file in \`packages/backend/src/remotion/\`\n`;
    instructions += `   - For HTML lessons: Edit the HTML file directly\n`;
    instructions += `3. Make the requested changes to the source files\n`;
    instructions += `4. After editing, re-render the lesson if needed:\n`;
    instructions += `   - Manim: \`cd packages/backend/src/manim && manim -qm sets_lesson.py\`\n`;
    instructions += `   - Remotion: Run the render script\n`;
    instructions += `5. Update \`studio-change-responses.json\` when complete\n`;
    instructions += `6. The browser will auto-refresh\n\n`;

    return instructions;
  }

  /**
   * Mark changes as completed and refresh browser
   */
  async markChangesCompleted(completedIds) {
    try {
      const data = JSON.parse(await fs.readFile(this.changeRequestsFile, 'utf-8'));

      // Move completed to history
      const completed = data.pendingRequests.filter(r => completedIds.includes(r.id));
      completed.forEach(r => {
        r.status = 'completed';
        r.completedAt = new Date().toISOString();
      });

      data.completedRequests = [...(data.completedRequests || []), ...completed];
      data.pendingRequests = data.pendingRequests.filter(r => !completedIds.includes(r.id));

      await fs.writeFile(this.changeRequestsFile, JSON.stringify(data, null, 2));

      console.log(`✅ Marked ${completedIds.length} request(s) as completed`);

      // Refresh browser
      this.refreshBrowser();

    } catch (error) {
      console.error('❌ Error marking changes complete:', error);
    }
  }

  /**
   * Send refresh signal to browser
   */
  refreshBrowser() {
    if (this.io) {
      console.log('🔄 Sending refresh signal to browser...');
      this.io.emit('refresh');
      console.log('✅ Browser refresh signal sent');
    }
  }

  /**
   * Stop the bridge agent
   */
  async stop() {
    if (this.watcher) {
      await this.watcher.close();
    }
    if (this.io) {
      this.io.close();
    }
    console.log('🛑 Studio Bridge Agent stopped');
  }
}

export default StudioBridgeAgent;
