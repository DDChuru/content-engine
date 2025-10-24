'use client';

import React, { useState } from 'react';
import { ImagePlus, Sparkles, FileText } from 'lucide-react';
import ImageGenerationPanel from './image-generation-panel';
import ImageGallery from './image-gallery';
import ContentCreationChat from './content-creation-chat';
import ContentOutputSelector from './content-output-selector';
import type { GeneratedImage, ContentType } from '@/types/content-workspace';

export default function ContentCreationWorkspace() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<GeneratedImage[]>([]);
  const [contentType, setContentType] = useState<ContentType>('html-reveal');
  const [activeTab, setActiveTab] = useState<'images' | 'content'>('images');

  const handleImageGenerated = (image: GeneratedImage) => {
    setImages(prev => [image, ...prev]);
  };

  const handleImageAccepted = (image: GeneratedImage) => {
    setImages(prev => [image, ...prev]);
  };

  const handleImageSelected = (image: GeneratedImage, selected: boolean) => {
    if (selected) {
      setSelectedImages(prev => [...prev, image]);
    } else {
      setSelectedImages(prev => prev.filter(img => img.id !== image.id));
    }
  };

  const handleImageRemoved = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
    setSelectedImages(prev => prev.filter(img => img.id !== imageId));
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Content Creation Workspace</h1>
                <p className="text-sm text-gray-400">Generate images and create content with AI</p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 bg-black/30 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('images')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                  activeTab === 'images'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ImagePlus className="w-4 h-4" />
                Image Generation
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                  activeTab === 'content'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                Content Creation
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'images' ? (
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-[1800px] mx-auto">
            {/* Left: Image Generation */}
            <div className="flex flex-col gap-4 overflow-hidden">
              <ImageGenerationPanel
                onImageGenerated={handleImageGenerated}
                onImageAccepted={handleImageAccepted}
              />
            </div>

            {/* Right: Image Gallery */}
            <div className="flex flex-col gap-4 overflow-hidden">
              <ImageGallery
                images={images}
                selectedImages={selectedImages}
                onImageSelected={handleImageSelected}
                onImageRemoved={handleImageRemoved}
              />
            </div>
          </div>
        ) : (
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-[1800px] mx-auto">
            {/* Left: Image References */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Referenced Images</h3>
                <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
                  {selectedImages.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <ImagePlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No images selected</p>
                      <p className="text-xs mt-1">Select images from the gallery to reference them</p>
                    </div>
                  ) : (
                    selectedImages.map(image => (
                      <div key={image.id} className="group relative">
                        <img
                          src={image.url}
                          alt={image.label}
                          className="w-full h-24 object-cover rounded-lg border border-white/10"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center">
                          <p className="text-white text-xs font-medium mb-1">{image.label}</p>
                          <p className="text-gray-300 text-xs px-2 text-center line-clamp-2">{image.prompt}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Content Output Selector */}
              <ContentOutputSelector
                selectedType={contentType}
                onTypeChange={setContentType}
              />
            </div>

            {/* Right: Content Creation Chat */}
            <div className="lg:col-span-2">
              <ContentCreationChat
                selectedImages={selectedImages}
                contentType={contentType}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
