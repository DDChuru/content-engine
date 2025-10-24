'use client';

import { useEffect, useMemo, useState } from 'react';
import { MessageSquarePlus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ChatInterface } from '@/components/chat-interface';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArtifactViewer } from '@/components/artifact-viewer';
import { AcsWorkspace } from '@/components/acs-workspace';
import type { WorkInstructionExtraction } from 'shared/types';

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
  { id: 'acs', name: 'ACS', color: 'from-slate-500 to-slate-700' },
] as const;

export default function Home() {
  const [activeProject, setActiveProject] = useState<string>('iclean');
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const generateChatId = () => `chat-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  const [chatSessionId, setChatSessionId] = useState<string>('chat-initial');
  const [instructions, setInstructions] = useState<WorkInstructionExtraction[]>([]);
  const [selectedInstructionId, setSelectedInstructionId] = useState<string | null>(null);
  const [isLoadingInstructions, setIsLoadingInstructions] = useState(false);

  useEffect(() => {
    if (chatSessionId === 'chat-initial') {
      const newId = generateChatId();
      console.debug('[Home] Hydrating chat session with ID:', newId);
      setChatSessionId(newId);
    }
  }, [chatSessionId]);

  const currentProject = PROJECTS.find(p => p.id === activeProject) || PROJECTS[0];
  const isACSProject = activeProject === 'acs';

  const handleNewChat = () => {
    setChatSessionId(generateChatId());
  };

  useEffect(() => {
    if (isACSProject) {
      const controller = new AbortController();
      const fetchInstructions = async () => {
        try {
          setIsLoadingInstructions(true);
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
          const response = await fetch(`${apiUrl}/api/extraction/work-instruction/acs?limit=20`, {
            signal: controller.signal
          });

          if (!response.ok) {
            throw new Error('Failed to load work instructions');
          }

          const payload = await response.json();
          const items = (payload?.data || []) as WorkInstructionExtraction[];
          const validItems = items.filter((item) => item?.section);
          setInstructions(validItems);
          setSelectedInstructionId(validItems[0]?.id ?? null);
        } catch (error) {
          if ((error as Error).name !== 'AbortError') {
            console.error('Failed to fetch work instructions:', error);
          }
        } finally {
          setIsLoadingInstructions(false);
        }
      };

      void fetchInstructions();

      return () => {
        controller.abort();
      };
    } else {
      setInstructions([]);
      setSelectedInstructionId(null);
    }
  }, [isACSProject]);

  const handleInstructionsImported = (records: WorkInstructionExtraction[]) => {
    const validRecords = records.filter((record) => record?.section);
    if (!validRecords.length) {
      return;
    }
    setInstructions((prev) => {
      const filteredPrev = prev.filter((item) => item?.section && !validRecords.some((record) => record.id === item.id));
      return [...validRecords, ...filteredPrev];
    });
    if (validRecords[0]) {
      setSelectedInstructionId(validRecords[0].id);
    }
  };

  const instructionPills = useMemo(() => {
    if (!isACSProject || instructions.length === 0) {
      return [];
    }
    return instructions
      .filter((instruction) => instruction.section)
      .map((instruction) => ({
        id: instruction.id,
        label:
          instruction.section?.title ||
          instruction.section?.documentMetadata.documentId ||
          instruction.sourceFile.name ||
          `Section ${instruction.id}`,
        isActive: instruction.id === selectedInstructionId
      }));
  }, [isACSProject, instructions, selectedInstructionId]);

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
            <Link
              href="/workspace/content-creation"
              className="mt-6 flex items-center gap-2 rounded-xl border border-purple-200 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:border-purple-400/30"
              title="Content Creation Workspace"
            >
              <Sparkles className="h-4 w-4" />
              <span>Content Workspace</span>
            </Link>
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
      <div
        className={`glass-panel flex-1 min-h-0 overflow-hidden rounded-[2.5rem] border border-transparent bg-white/30 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.5)] backdrop-blur-xl transition-colors dark:bg-white/5 dark:shadow-[0_35px_80px_-50px_rgba(2,6,23,0.9)] ${
          isACSProject ? '' : 'p-6 grid grid-cols-1 gap-4 lg:grid-cols-2'
        }`}
      >
        {isACSProject ? (
          <AcsWorkspace
            instructions={instructions}
            selectedInstructionId={selectedInstructionId}
            onSelectInstruction={(id) => setSelectedInstructionId(id)}
            onImportComplete={handleInstructionsImported}
          />
        ) : (
          <>
            <div className="flex min-h-0 flex-col rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-[0_18px_50px_-26px_rgba(15,23,42,0.45)] backdrop-blur transition-colors dark:border-white/10 dark:bg-slate-900/70 dark:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.75)]">
              <h2 className="mb-4 text-xl font-semibold text-slate-900 transition-colors dark:text-white">Chat with Claude</h2>
              <ChatInterface
                key={chatSessionId}
                activeProject={activeProject}
                chatSessionId={chatSessionId}
                onArtifactSelect={setSelectedArtifact}
              />
            </div>
            <div className="flex flex-col">
              <ArtifactViewer
                artifact={selectedArtifact}
                onClose={() => setSelectedArtifact(null)}
              />
            </div>
          </>
        )}
      </div>

      {/* Status Bar */}
      <div className="glass-panel mt-4 rounded-3xl border border-slate-200/70 bg-white/70 p-2 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur transition-colors dark:border-white/10 dark:bg-slate-900/70">
        <div className="flex justify-between text-sm text-slate-600 transition-colors dark:text-white/80">
          <span>Status: Connected {isACSProject && isLoadingInstructions ? '(Syncing imports...)' : ''}</span>
          <span>Backend: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}</span>
        </div>
      </div>
    </div>
  );
}
