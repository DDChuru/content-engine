'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Download, ExternalLink, Sparkles } from 'lucide-react';
import type { GeneratedImage, ContentType } from '@/types/content-workspace';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  imageReferences?: string[]; // Image IDs referenced in this message
  artifact?: {
    type: string;
    url?: string;
    content?: string;
  };
}

interface ContentCreationChatProps {
  selectedImages: GeneratedImage[];
  contentType: ContentType;
}

export default function ContentCreationChat({
  selectedImages,
  contentType
}: ContentCreationChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
      imageReferences: selectedImages.map(img => img.id)
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/content/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          contentType,
          imageReferences: selectedImages.map(img => ({
            id: img.id,
            url: img.firestoreUrl || img.url,
            label: img.label,
            prompt: img.prompt
          })),
          conversationHistory: messages
        })
      });

      if (!response.ok) {
        throw new Error('Content generation failed');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString(),
        artifact: data.artifact
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Content creation error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error generating your content. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const downloadArtifact = (artifact: Message['artifact']) => {
    if (!artifact) return;

    if (artifact.url) {
      window.open(artifact.url, '_blank');
    } else if (artifact.content) {
      const blob = new Blob([artifact.content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `content-${Date.now()}.html`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Content Creation
            </h3>
            <p className="text-sm text-gray-400">
              Creating {contentType.replace('-', ' ')} with {selectedImages.length} image reference{selectedImages.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Sparkles className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">Start creating content</p>
            <p className="text-sm mt-1 text-center max-w-md">
              Describe what you want to create. Reference your images by their labels,
              and I'll generate content with them included.
            </p>
            {selectedImages.length > 0 && (
              <div className="mt-4 text-sm">
                <p className="text-gray-500 mb-2">Available images:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedImages.map(img => (
                    <span
                      key={img.id}
                      className="px-3 py-1 bg-purple-600/20 border border-purple-400/30 rounded-full text-purple-300"
                    >
                      {img.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-gray-100'
                  }`}
                >
                  {/* Message Content */}
                  <p className="whitespace-pre-wrap">{message.content}</p>

                  {/* Image References */}
                  {message.imageReferences && message.imageReferences.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <p className="text-xs opacity-70 mb-2">Referenced images:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.imageReferences.map(imgId => {
                          const img = selectedImages.find(i => i.id === imgId);
                          return img ? (
                            <span
                              key={imgId}
                              className="px-2 py-1 bg-white/10 rounded text-xs"
                            >
                              {img.label}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {/* Artifact */}
                  {message.artifact && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          Generated {message.artifact.type}
                        </p>
                        <div className="flex gap-2">
                          {message.artifact.url && (
                            <button
                              onClick={() => window.open(message.artifact!.url, '_blank')}
                              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                              title="Open in new tab"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => downloadArtifact(message.artifact)}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {message.artifact.url && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-white/10">
                          <iframe
                            src={message.artifact.url}
                            className="w-full h-64 bg-white"
                            title="Generated content"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Timestamp */}
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-purple-200' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Describe the ${contentType.replace('-', ' ')} you want to create...`}
            disabled={isGenerating}
            className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 resize-none disabled:opacity-50"
            rows={3}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all self-end"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
