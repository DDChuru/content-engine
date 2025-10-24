'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function ContentWorkspaceSimple() {
  const [activeTab, setActiveTab] = useState<'images' | 'content'>('images');

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-bold text-white">Content Creation Workspace</h1>
        </div>
      </header>

      <div className="flex-1 p-8">
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('images')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'images' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300'
              }`}
            >
              Images
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'content' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300'
              }`}
            >
              Content
            </button>
          </div>

          <div className="text-white">
            {activeTab === 'images' ? (
              <div>
                <h2 className="text-xl font-bold mb-4">Image Generation</h2>
                <p className="text-gray-400">Image generation panel will go here</p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-4">Content Creation</h2>
                <p className="text-gray-400">Content creation chat will go here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
