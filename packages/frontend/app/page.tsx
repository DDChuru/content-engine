'use client';

import { useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { ChatInterface } from '@/components/chat-interface';
import { GenerationPanel } from '@/components/generation-panel';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArtifactViewer } from '@/components/artifact-viewer';

interface Artifact {
  type: string;
  title: string;
  identifier: string;
  contentUrl: string;
  thumbnail?: string;
  metadata?: any;
}

const PROJECTS = [
  { id: 'iclean', name: 'iClean', color: 'from-blue-500 to-cyan-500' },
  { id: 'haccp', name: 'HACCP Audits', color: 'from-green-500 to-emerald-500' },
  { id: 'math', name: 'Math Platform', color: 'from-purple-500 to-pink-500' },
  { id: 'peakflow', name: 'PeakFlow', color: 'from-orange-500 to-red-500' },
] as const;

export default function Home() {
  const [activeProject, setActiveProject] = useState<string>('iclean');
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [chatSessionId, setChatSessionId] = useState<string>(() => `chat-${Date.now()}`);

  const currentProject = PROJECTS.find(p => p.id === activeProject) || PROJECTS[0];

  const handleNewChat = () => {
    const newChatId = `chat-${Date.now()}`;
    setChatSessionId(newChatId);
  };

  return (
    <div className="container mx-auto flex h-screen flex-col p-4 pb-8">
      {/* Header */}
      <div className="glass-panel mb-4 rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-[0_20px_45px_-25px_rgba(15,23,42,0.45)] backdrop-blur transition-colors dark:border-white/10 dark:bg-slate-900/70 dark:shadow-[0_25px_60px_-30px_rgba(0,0,0,0.8)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 transition-colors dark:text-white">Content Engine Cloud</h1>
            <p className="text-slate-600 transition-colors dark:text-white/80">AI-powered content generation with Claude</p>
          </div>

          {/* Project Selector and Actions */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Active Project</p>
              <select
                value={activeProject}
                onChange={(e) => setActiveProject(e.target.value)}
                className="mt-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:border-teal-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-white/20 dark:bg-slate-800 dark:text-white dark:hover:border-cyan-400 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/40"
              >
                {PROJECTS.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleNewChat}
              className="mt-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:border-teal-400 hover:bg-teal-50 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-white/20 dark:bg-slate-800 dark:text-white dark:hover:border-cyan-400 dark:hover:bg-cyan-900/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/40"
              title="Start new chat"
            >
              <MessageSquarePlus className="h-4 w-4" />
              <span>New Chat</span>
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Project Indicator */}
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-2 transition-colors dark:border-white/10 dark:bg-slate-800/50">
          <div className={`h-3 w-3 rounded-full bg-gradient-to-br ${currentProject.color} shadow-lg`}></div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            All content will be saved to <span className="font-bold">{currentProject.name}</span> project
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="glass-panel flex-1 min-h-0 grid grid-cols-1 gap-4 rounded-[2.5rem] border border-transparent bg-white/30 p-6 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.5)] backdrop-blur-xl transition-colors dark:bg-white/5 dark:shadow-[0_35px_80px_-50px_rgba(2,6,23,0.9)] lg:grid-cols-2">
        {/* Chat Panel */}
        <div className="flex flex-col rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-[0_18px_50px_-26px_rgba(15,23,42,0.45)] backdrop-blur transition-colors dark:border-white/10 dark:bg-slate-900/70 dark:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.75)]">
          <h2 className="mb-4 text-xl font-semibold text-slate-900 transition-colors dark:text-white">Chat with Claude</h2>
          <ChatInterface
            activeProject={activeProject}
            chatSessionId={chatSessionId}
            onArtifactSelect={setSelectedArtifact}
          />
        </div>

        {/* Artifact Viewer */}
        <div className="flex flex-col">
          <ArtifactViewer
            artifact={selectedArtifact}
            onClose={() => setSelectedArtifact(null)}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="glass-panel mt-4 rounded-3xl border border-slate-200/70 bg-white/70 p-2 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur transition-colors dark:border-white/10 dark:bg-slate-900/70">
        <div className="flex justify-between text-sm text-slate-600 transition-colors dark:text-white/80">
          <span>Status: Connected</span>
          <span>Backend: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}</span>
        </div>
      </div>
    </div>
  );
}