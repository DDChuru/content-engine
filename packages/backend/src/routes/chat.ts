/**
 * Chat routes for Claude AI integration
 */

import { Router, Request, Response } from 'express';
import admin from 'firebase-admin';
import { ClaudeService } from '../services/claude.js';
import { ContentGenerator } from '../services/content-generator.js';
import { getFirebaseProject } from '../services/firebase.js';

const router = Router();

/**
 * Send message to Claude
 */
router.post('/message', async (req: Request, res: Response) => {
  try {
    const { messages, systemPrompt, activeProject, model } = req.body;
    const claude: ClaudeService = req.app.locals.claude;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Messages array is required'
      });
    }

    if (!activeProject) {
      return res.status(400).json({
        error: 'Active project is required'
      });
    }

    // Define tools for Claude to use
    const tools = [
      {
        name: 'generate_user_manual',
        description: 'Generate a user manual from a codebase. If targetProject is specified (iclean, haccp, math, peakflow), the system will automatically use the configured repository (local or GitHub). You do NOT need to provide repoUrl when targetProject is set.',
        input_schema: {
          type: 'object',
          properties: {
            repoUrl: {
              type: 'string',
              description: 'Optional: GitHub repository URL or local path. Not needed if targetProject is specified, as each project has a pre-configured repository location.'
            },
            features: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of feature names to analyze and document (e.g., ["Contracts", "Invoices", "Quotes"])'
            },
            title: { type: 'string', description: 'Title for the user manual' },
            subtitle: { type: 'string', description: 'Optional subtitle for the user manual' },
            targetProject: {
              type: 'string',
              enum: ['iclean', 'haccp', 'math', 'peakflow', 'acs'],
              description: 'Target project. Each project has a pre-configured repository location (PeakFlow uses local path: /home/dachu/Documents/projects/vercel/peakflow)'
            }
          },
          required: ['features', 'title', 'targetProject']
        }
      },
      {
        name: 'generate_sop',
        description: 'Generate a Standard Operating Procedure',
        input_schema: {
          type: 'object',
          properties: {
            task: { type: 'string' },
            category: { type: 'string' },
            industry: { type: 'string' },
            targetProject: { type: 'string' }
          },
          required: ['task', 'category']
        }
      },
      {
        name: 'generate_lesson',
        description: 'Generate an educational lesson',
        input_schema: {
          type: 'object',
          properties: {
            topic: { type: 'string' },
            syllabus: { type: 'string' },
            difficulty: {
              type: 'string',
              enum: ['foundation', 'intermediate', 'advanced']
            },
            targetProject: { type: 'string' }
          },
          required: ['topic', 'syllabus']
        }
      },
      {
        name: 'import_work_instruction',
        description: 'Retrieve a previously imported work instruction by its ID',
        input_schema: {
          type: 'object',
          properties: {
            documentId: { type: 'string', description: 'Work instruction document ID' },
            project: {
              type: 'string',
              enum: ['acs', 'iclean', 'haccp', 'math', 'peakflow'],
              description: 'Project that stores the work instruction (defaults to active project)'
            }
          },
          required: ['documentId']
        }
      }
    ];

    // Send message to Claude with tools
    const response = await claude.sendMessage(messages, tools, systemPrompt, model);

    // Check if Claude wants to use a tool
    if (claude.isToolUse(response)) {
      const toolUse = claude.extractToolUse(response);
      const contentGenerator: ContentGenerator = req.app.locals.contentGenerator;

      // Execute the tool
      let toolResult;
      switch (toolUse.name) {
        case 'generate_user_manual':
          toolResult = await contentGenerator.generate({
            type: 'user-manual',
            repoUrl: toolUse.input.repoUrl,
            parameters: toolUse.input,
            targetProject: activeProject
          });
          break;

        case 'generate_sop':
          toolResult = await contentGenerator.generate({
            type: 'sop',
            parameters: toolUse.input,
            targetProject: activeProject
          });
          break;

        case 'generate_lesson':
          toolResult = await contentGenerator.generate({
            type: 'lesson',
            parameters: toolUse.input,
            targetProject: activeProject
          });
          break;

        case 'import_work_instruction': {
          const documentId = toolUse.input.documentId;
          const targetProject =
            toolUse.input.project || activeProject || 'acs';

          if (!documentId) {
            toolResult = { success: false, error: 'documentId is required' };
            break;
          }

          try {
            const instruction = await readFromFirestore(
              targetProject,
              'work_instructions',
              documentId
            );

            toolResult = {
              success: true,
              section: instruction.section,
              metadata: {
                project: targetProject,
                id: instruction.id,
                parentDocumentId: instruction.parentDocumentId,
                createdAt: instruction.createdAt,
                updatedAt: instruction.updatedAt,
                sourceFile: instruction.sourceFile
              }
            };
          } catch (fetchError: any) {
            toolResult = {
              success: false,
              error: fetchError?.message || 'Failed to fetch work instruction'
            };
          }
          break;
        }

        default:
          toolResult = { error: `Unknown tool: ${toolUse.name}` };
      }

      // Continue conversation with tool result
      const finalResponse = await claude.continueAfterTool(
        messages,
        response, // The assistant's response containing tool_use
        toolResult,
        toolUse.id,
        tools, // Pass the same tools
        systemPrompt,
        model
      );

      // Build artifact metadata for frontend
      let artifact = null;
      if (toolResult.success && toolResult.htmlUrl) {
        artifact = {
          type: toolResult.type || toolUse.name.replace('generate_', ''),
          title: toolUse.input.title || toolUse.input.task || toolUse.input.topic || 'Generated Content',
          identifier: toolResult.firebaseDocId || `artifact-${Date.now()}`,
          contentUrl: toolResult.htmlUrl,
          thumbnail: toolResult.thumbnailUrl,
          metadata: {
            generatedAt: new Date().toISOString(),
            repository: toolUse.input.repoUrl,
            features: toolUse.input.features,
            targetProject: activeProject,
            ...toolResult.metadata
          }
        };
      }

      res.json({
        response: finalResponse,
        toolUsed: toolUse.name,
        toolResult,
        artifact
      });
    } else {
      // Regular response without tool use
      res.json({
        response
      });
    }
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * Analyze user intent
 */
router.post('/analyze-intent', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const claude: ClaudeService = req.app.locals.claude;

    if (!message) {
      return res.status(400).json({
        error: 'Message is required'
      });
    }

    const intent = await claude.analyzeIntent(message);

    res.json(intent);
  } catch (error: any) {
    console.error('Intent analysis error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * Save chat message to Firestore
 */
router.post('/save', async (req: Request, res: Response) => {
  try {
    const { project, chatId, message } = req.body;

    if (!project || !chatId || !message) {
      return res.status(400).json({
        error: 'Project, chatId, and message are required'
      });
    }

    // Get Firebase project
    const firebaseProject = getFirebaseProject(project);
    if (!firebaseProject) {
      return res.status(400).json({
        error: `Firebase project ${project} not initialized`
      });
    }

    const db = firebaseProject.db;

    // Reference to chat document
    const chatRef = db.collection('chats').doc(chatId);

    // Check if chat exists, create if not
    const chatDoc = await chatRef.get();
    if (!chatDoc.exists) {
      await chatRef.set({
        createdAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        messageCount: 0
      });
    }

    // Save message to subcollection
    const messageRef = chatRef.collection('messages').doc(message.id);
    await messageRef.set({
      role: message.role,
      content: message.content,
      timestamp: message.timestamp,
      artifact: message.artifact || null
    });

    // Update chat metadata
    await chatRef.update({
      lastMessageAt: message.timestamp,
      messageCount: admin.firestore.FieldValue.increment(1)
    });

    res.json({
      success: true,
      chatId,
      messageId: message.id
    });
  } catch (error: any) {
    console.error('Save message error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;
