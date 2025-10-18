'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { ArtifactCard } from './artifact-card';

interface Artifact {
  type: string;
  title: string;
  identifier: string;
  contentUrl: string;
  thumbnail?: string;
  metadata?: any;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  artifact?: Artifact;
}

interface ChatInterfaceProps {
  activeProject: string;
  chatSessionId: string;
  onArtifactSelect?: (artifact: Artifact) => void;
}

const MODELS = [
  { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5', description: 'Fast & affordable' },
  { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5', description: 'Best balance' },
  { id: 'claude-opus-4-1-20250805', name: 'Claude Opus 4.1', description: 'Most capable' },
] as const;

export function ChatInterface({ activeProject, chatSessionId, onArtifactSelect }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude-haiku-4-5-20251001');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) =>
    new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);

  useEffect(() => {
    // Initialize welcome message on client side only
    setIsMounted(true);
  }, []);

  // Clear messages when chat session changes (new chat started)
  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I can help you generate content. Try asking me to create a user manual, SOP, or educational lesson.',
        timestamp: new Date(),
      },
    ]);
  }, [chatSessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-save message to Firestore
  const saveMessageToFirestore = async (message: Message) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await fetch(`${apiUrl}/api/chat/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: activeProject,
          chatId: chatSessionId,
          message: {
            id: message.id,
            role: message.role,
            content: message.content,
            timestamp: message.timestamp.toISOString(),
            artifact: message.artifact
          }
        })
      });
    } catch (error) {
      console.error('Failed to save message:', error);
      // Don't throw - we don't want to break the chat if save fails
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Auto-save user message
    await saveMessageToFirestore(userMessage);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          activeProject,
          model: selectedModel,
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response?.content?.[0]?.text || 'I generated the content successfully!',
        timestamp: new Date(),
        artifact: data.artifact || undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Auto-save assistant message
      await saveMessageToFirestore(assistantMessage);

      // Auto-select artifact if present
      if (data.artifact && onArtifactSelect) {
        onArtifactSelect(data.artifact);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="glass-panel flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 shadow-[0_15px_40px_-24px_rgba(15,23,42,0.45)] backdrop-blur-2xl transition-all duration-500 dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_30px_70px_-40px_rgba(0,0,0,0.85)]">
      <div className="flex items-center gap-4 border-b border-slate-200/80 px-6 py-5 transition-colors dark:border-white/10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg">
          <Bot className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 transition-colors dark:text-slate-300">Claude Assistant</p>
          <p className="text-lg font-semibold text-slate-900 transition-colors dark:text-white">How can I help today?</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs font-medium text-emerald-500 transition-colors dark:text-emerald-300/90">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Live
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse text-right' : 'flex-row'} animate-fade-in`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 shadow-lg transition-colors dark:border-white/15 ${
                  isUser
                    ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800/90 dark:text-slate-200'
                }`}
              >
                {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              <div className={`max-w-[75%] space-y-2 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}> 
                <div
                  className={`text-xs font-semibold uppercase tracking-wide transition-colors ${
                    isUser ? 'text-teal-600 dark:text-white/60' : 'text-slate-500 dark:text-white/50'
                  }`}
                >
                  {isUser ? 'You' : 'Claude'}
                </div>
                <div
                  className={`w-full rounded-3xl border border-slate-200/70 px-5 py-4 text-sm leading-relaxed shadow-[0_12px_30px_-22px_rgba(15,23,42,0.45)] backdrop-blur transition-all duration-500 dark:border-white/10 dark:shadow-[0_20px_45px_-30px_rgba(0,0,0,0.8)] ${
                    isUser
                      ? 'bg-gradient-to-br from-teal-500 via-cyan-500 to-sky-500 text-white'
                      : 'bg-white/90 text-slate-800 dark:bg-slate-800/80 dark:text-slate-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {/* Render artifact card if present */}
                {message.artifact && (
                  <div className="mt-3">
                    <ArtifactCard
                      artifact={message.artifact}
                      onClick={() => onArtifactSelect?.(message.artifact!)}
                    />
                  </div>
                )}
                <span
                  className="text-[11px] uppercase tracking-wide text-slate-400 transition-colors dark:text-white/40"
                  suppressHydrationWarning
                >
                  {isMounted ? formatTime(message.timestamp) : ''}
                </span>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100 text-slate-700 transition-colors dark:border-white/20 dark:bg-slate-800/80 dark:text-slate-200">
              <Bot className="h-5 w-5" />
            </div>
            <div className="rounded-3xl border border-slate-200/70 bg-slate-100/90 px-5 py-4 text-slate-600 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.45)] transition-all duration-500 dark:border-white/10 dark:bg-slate-800/80 dark:text-slate-200 dark:shadow-[0_20px_45px_-30px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-teal-600 dark:text-white/70">Drafting reply</span>
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-teal-400/80 dark:bg-white/50" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-teal-400/80 dark:bg-white/50" style={{ animationDelay: '120ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-teal-400/80 dark:bg-white/50" style={{ animationDelay: '240ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
        className="border-t border-slate-200/80 bg-white/90 px-6 py-5 shadow-[inset_0_5px_15px_-15px_rgba(15,23,42,0.35)] transition-all duration-500 dark:border-white/10 dark:bg-slate-900/80 dark:shadow-[inset_0_5px_20px_-18px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-end gap-3">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me to generate content..."
              rows={1}
              className="min-h-[48px] w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-5 py-3 text-sm text-slate-800 placeholder:text-slate-400 shadow-inner transition-colors focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-white/20 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-white/60 dark:focus:border-cyan-300 dark:focus:ring-indigo-400/40"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg transition hover:from-teal-400 hover:to-cyan-500 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {/* Model Selector */}
        <div className="mt-3 flex items-center gap-3">
          <label htmlFor="model-select" className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Model
          </label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-all hover:border-teal-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-white/20 dark:bg-slate-800 dark:text-white dark:hover:border-cyan-400 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/40"
            disabled={isLoading}
          >
            {MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} — {model.description}
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
}