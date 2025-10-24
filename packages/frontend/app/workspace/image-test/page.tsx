'use client';

import React, { useState } from 'react';
import ImageGenerationPanel from '@/components/image-generation-panel';

export default function ImageTestPage() {
  const [images, setImages] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <h1 className="text-2xl font-bold text-white mb-4">Image Generation Test</h1>
      <div className="max-w-2xl">
        <ImageGenerationPanel
          onImageGenerated={(img) => console.log('Generated:', img)}
          onImageAccepted={(img) => {
            console.log('Accepted:', img);
            setImages(prev => [...prev, img]);
          }}
        />
      </div>
      <div className="mt-8 text-white">
        <h2 className="text-xl font-bold mb-2">Accepted Images:</h2>
        <pre className="bg-slate-800 p-4 rounded overflow-auto">
          {JSON.stringify(images, null, 2)}
        </pre>
      </div>
    </div>
  );
}
