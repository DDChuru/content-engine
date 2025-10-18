'use client';

import { FileText, ChevronRight } from 'lucide-react';

interface ArtifactCardProps {
  artifact: {
    type: string;
    title: string;
    identifier: string;
    contentUrl: string;
    thumbnail?: string;
    metadata?: any;
  };
  onClick: () => void;
}

export function ArtifactCard({ artifact, onClick }: ArtifactCardProps) {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'user-manual': 'User Manual',
      'sop': 'Standard Operating Procedure',
      'lesson': 'Educational Lesson',
      'training': 'Training Material'
    };
    return labels[type] || type;
  };

  const getTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      'user-manual': 'bg-blue-500/20 text-blue-400 border-blue-400/30',
      'sop': 'bg-green-500/20 text-green-400 border-green-400/30',
      'lesson': 'bg-purple-500/20 text-purple-400 border-purple-400/30',
      'training': 'bg-orange-500/20 text-orange-400 border-orange-400/30'
    };
    return colors[type] || 'bg-slate-500/20 text-slate-400 border-slate-400/30';
  };

  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/85 p-4 text-left shadow-[0_15px_35px_-25px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-400/50 hover:bg-white/95 hover:shadow-[0_20px_45px_-20px_rgba(13,148,136,0.45)] dark:border-white/10 dark:bg-slate-800/80 dark:shadow-[0_25px_55px_-35px_rgba(0,0,0,0.8)] dark:hover:border-cyan-400/50 dark:hover:bg-slate-800 dark:hover:shadow-[0_28px_60px_-32px_rgba(14,165,233,0.5)]"
    >
      {/* Thumbnail or Icon */}
      <div className="glass-panel flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200/70 bg-slate-100 shadow-inner dark:border-white/10 dark:bg-slate-700">
        {artifact.thumbnail ? (
          <img
            src={artifact.thumbnail}
            alt={artifact.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <FileText className="h-8 w-8 text-slate-400 dark:text-slate-500" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-semibold text-slate-900 transition-colors dark:text-white">
            {artifact.title}
          </h3>
          <ChevronRight className="h-5 w-5 flex-shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 dark:text-slate-500" />
        </div>
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getTypeBadgeColor(artifact.type)}`}>
          {getTypeLabel(artifact.type)}
        </span>
      </div>
    </button>
  );
}
