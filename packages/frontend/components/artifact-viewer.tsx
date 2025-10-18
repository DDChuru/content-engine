'use client';

import { X, Download, ExternalLink, Maximize2 } from 'lucide-react';

interface ArtifactViewerProps {
  artifact: {
    type: string;
    title: string;
    identifier: string;
    contentUrl: string;
    thumbnail?: string;
    metadata?: any;
  } | null;
  onClose: () => void;
}

export function ArtifactViewer({ artifact, onClose }: ArtifactViewerProps) {
  if (!artifact) {
    return (
    <div className="glass-panel flex h-full items-center justify-center rounded-3xl border border-slate-200/70 bg-white/60 p-8 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.4)] backdrop-blur transition-colors dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_25px_60px_-35px_rgba(0,0,0,0.85)]">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="glass-panel flex h-16 w-16 items-center justify-center rounded-full border border-slate-200/60 bg-slate-100 shadow-[inset_0_12px_25px_-22px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-800 dark:shadow-[inset_0_12px_30px_-25px_rgba(0,0,0,0.6)]">
              <Maximize2 className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
            No artifact selected
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Generate content to view it here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 shadow-[0_25px_55px_-30px_rgba(15,23,42,0.45)] backdrop-blur-2xl transition-colors dark:border-white/10 dark:bg-slate-900/90 dark:shadow-[0_35px_80px_-40px_rgba(0,0,0,0.85)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/70 px-6 py-4 transition-colors dark:border-white/10">
        <div className="flex-1 min-w-0">
          <h2 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
            {artifact.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {artifact.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href={artifact.contentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-700 transition-all hover:border-teal-400/50 hover:bg-slate-50 hover:text-teal-600 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-cyan-400/50 dark:hover:bg-slate-700 dark:hover:text-cyan-400"
            title="Open in new tab"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
          <a
            href={artifact.contentUrl}
            download
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-700 transition-all hover:border-teal-400/50 hover:bg-slate-50 hover:text-teal-600 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-cyan-400/50 dark:hover:bg-slate-700 dark:hover:text-cyan-400"
            title="Download"
          >
            <Download className="h-5 w-5" />
          </a>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-700 transition-all hover:border-red-400/50 hover:bg-red-50 hover:text-red-600 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-red-400/50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-slate-950">
        <iframe
          src={artifact.contentUrl}
          title={artifact.title}
          className="h-full w-full border-0"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>

      {/* Footer with metadata */}
      {artifact.metadata && (
        <div className="border-t border-slate-200/70 bg-slate-50/80 px-6 py-3 shadow-[inset_0_5px_18px_-18px_rgba(15,23,42,0.3)] transition-colors dark:border-white/10 dark:bg-slate-900/80 dark:shadow-[inset_0_6px_22px_-20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">
              Generated: {new Date(artifact.metadata.generatedAt).toLocaleString()}
            </span>
            {artifact.metadata.targetProject && (
              <span className="rounded-full bg-slate-200 px-2 py-1 font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                {artifact.metadata.targetProject}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
