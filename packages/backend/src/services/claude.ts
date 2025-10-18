/**
 * Claude Service
 * Handles all interactions with Claude AI
 */

import Anthropic from '@anthropic-ai/sdk';
import type { Message, Tool } from '@anthropic-ai/sdk/resources/messages';

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string | any[];
}

export interface ClaudeTool {
  name: string;
  description: string;
  input_schema: any;
}

export class ClaudeService {
  private client: Anthropic;
  private model: string = 'claude-haiku-4-5-20251001';

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  /**
   * Send a message to Claude
   */
  async sendMessage(
    messages: ClaudeMessage[],
    tools?: ClaudeTool[],
    systemPrompt?: string,
    model?: string
  ): Promise<any> {
    try {
      const response = await this.client.messages.create({
        model: model || this.model,
        max_tokens: 4096,
        messages: messages as any,
        system: systemPrompt,
        tools: tools as any
      });

      return response;
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }

  /**
   * Analyze user intent for content generation
   */
  async analyzeIntent(userMessage: string): Promise<{
    intent: string;
    contentType?: string;
    parameters?: any;
    targetProject?: string;
  }> {
    const tools: ClaudeTool[] = [
      {
        name: 'determine_intent',
        description: 'Determine the user\'s intent for content generation',
        input_schema: {
          type: 'object',
          properties: {
            intent: {
              type: 'string',
              enum: ['generate_manual', 'generate_sop', 'generate_lesson', 'generate_training', 'analyze_code', 'other']
            },
            contentType: {
              type: 'string',
              description: 'Type of content to generate'
            },
            parameters: {
              type: 'object',
              description: 'Parameters for generation'
            },
            targetProject: {
              type: 'string',
              enum: ['iclean', 'haccp', 'math', 'peakflow'],
              description: 'Target Firebase project'
            }
          },
          required: ['intent']
        }
      }
    ];

    const response = await this.sendMessage(
      [{ role: 'user', content: userMessage }],
      tools,
      'You are a helpful AI assistant that analyzes user requests for content generation. Determine what the user wants to create and which project it\'s for.'
    );

    // Check if Claude used a tool
    if (response.stop_reason === 'tool_use') {
      const toolUse = response.content.find((c: any) => c.type === 'tool_use');
      if (toolUse && toolUse.name === 'determine_intent') {
        return toolUse.input;
      }
    }

    // Default response if no tool was used
    return {
      intent: 'other',
      contentType: 'unknown'
    };
  }

  /**
   * Generate content based on parameters
   */
  async generateContent(
    contentType: string,
    parameters: any,
    context?: string
  ): Promise<{
    content: string;
    title?: string;
    metadata?: any;
  }> {
    const systemPrompt = `You are an expert content creator specializing in ${contentType}.
    Generate high-quality, professional content based on the parameters provided.
    ${context ? `Context: ${context}` : ''}`;

    const userPrompt = `Generate ${contentType} with the following parameters:
    ${JSON.stringify(parameters, null, 2)}`;

    const response = await this.sendMessage(
      [{ role: 'user', content: userPrompt }],
      undefined,
      systemPrompt
    );

    // Parse the response
    const content = response.content[0].text;

    // Try to extract title and metadata from the content
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : `Generated ${contentType}`;

    return {
      content,
      title,
      metadata: {
        generatedAt: new Date().toISOString(),
        model: this.model,
        contentType
      }
    };
  }

  /**
   * Create a conversational summary of generated content
   */
  async summarizeContent(
    content: any,
    contentType: string
  ): Promise<string> {
    const prompt = `Summarize the following ${contentType} that was just generated:
    ${JSON.stringify(content, null, 2)}

    Provide a brief, friendly summary that tells the user what was created.`;

    const response = await this.sendMessage(
      [{ role: 'user', content: prompt }],
      undefined,
      'You are a helpful assistant that summarizes generated content for users.'
    );

    return response.content[0].text;
  }

  /**
   * Handle tool use responses
   */
  async handleToolUse(
    toolUse: any,
    toolHandlers: Map<string, (input: any) => Promise<any>>
  ): Promise<any> {
    const handler = toolHandlers.get(toolUse.name);
    if (!handler) {
      throw new Error(`No handler for tool: ${toolUse.name}`);
    }

    return await handler(toolUse.input);
  }

  /**
   * Continue conversation after tool use
   */
  async continueAfterTool(
    messages: ClaudeMessage[],
    assistantResponse: any, // The response containing tool_use
    toolResult: any,
    toolUseId: string,
    model?: string
  ): Promise<any> {
    // Build proper message history:
    // 1. Original messages
    // 2. Assistant message with tool_use
    // 3. User message with tool_result
    const updatedMessages = [
      ...messages,
      {
        role: 'assistant' as const,
        content: assistantResponse.content
      },
      {
        role: 'user' as const,
        content: [
          {
            type: 'tool_result',
            tool_use_id: toolUseId,
            content: JSON.stringify(toolResult)
          }
        ]
      }
    ];

    return await this.sendMessage(updatedMessages, undefined, undefined, model);
  }

  /**
   * Check if response indicates tool use
   */
  isToolUse(response: any): boolean {
    return response.stop_reason === 'tool_use';
  }

  /**
   * Extract tool use from response
   */
  extractToolUse(response: any): any {
    return response.content.find((c: any) => c.type === 'tool_use');
  }
}

export default ClaudeService;