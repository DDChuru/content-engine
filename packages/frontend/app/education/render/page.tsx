'use client';

import React from 'react';
import { Play } from 'lucide-react';

export default function RenderPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Render Manager</h1>
        <p className="text-zinc-400">Monitor video rendering progress</p>
      </header>

      <div className="flex items-center justify-center h-64 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="text-center">
          <Play size={48} className="mx-auto mb-4 text-zinc-600" />
          <p className="text-zinc-500">No renders in queue</p>
        </div>
      </div>
    </div>
  );
}
