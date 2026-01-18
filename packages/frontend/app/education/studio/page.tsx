'use client';

import React from 'react';
import { Wand2 } from 'lucide-react';

export default function StudioPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Studio Editor</h1>
        <p className="text-zinc-400">Edit and preview your video lessons</p>
      </header>

      <div className="flex items-center justify-center h-64 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="text-center">
          <Wand2 size={48} className="mx-auto mb-4 text-zinc-600" />
          <p className="text-zinc-500">Select a lesson to edit in the studio</p>
        </div>
      </div>
    </div>
  );
}
