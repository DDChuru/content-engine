'use client';

import React from 'react';
import { BookOpen, Plus } from 'lucide-react';

export default function LessonsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Lesson Builder</h1>
        <p className="text-zinc-400">Create and manage your educational lessons</p>
      </header>

      <div className="flex items-center justify-center h-64 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-zinc-600" />
          <p className="text-zinc-500 mb-4">No lessons created yet</p>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors mx-auto">
            <Plus size={20} />
            Create New Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
