'use client';

import React from 'react';
import { FileText, Video, Presentation, PenTool } from 'lucide-react';
import type { ContentType } from '@/types/content-workspace';

interface ContentOutputSelectorProps {
  selectedType: ContentType;
  onTypeChange: (type: ContentType) => void;
}

const outputTypes = [
  {
    type: 'html-reveal' as const,
    label: 'Reveal.js Presentation',
    description: 'Interactive HTML presentation with slide transitions',
    icon: Presentation,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    type: 'remotion-video' as const,
    label: 'Remotion Video',
    description: 'Programmatic video with animations and branding',
    icon: Video,
    color: 'from-purple-500 to-pink-500'
  },
  {
    type: 'plain-html' as const,
    label: 'Plain HTML',
    description: 'Standard HTML document with styling',
    icon: FileText,
    color: 'from-green-500 to-emerald-500'
  },
  {
    type: 'annotation' as const,
    label: 'Annotation',
    description: 'Interactive annotation and markup tool',
    icon: PenTool,
    color: 'from-orange-500 to-red-500'
  }
];

export default function ContentOutputSelector({
  selectedType,
  onTypeChange
}: ContentOutputSelectorProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4">
      <h3 className="text-sm font-semibold text-white mb-3">Output Format</h3>
      <div className="space-y-2">
        {outputTypes.map(({ type, label, description, icon: Icon, color }) => {
          const isSelected = selectedType === type;
          return (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-white/10 border-purple-400'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 bg-gradient-to-br ${color} rounded-lg`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    isSelected ? 'text-white' : 'text-gray-300'
                  }`}>
                    {label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                </div>
                {isSelected && (
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
