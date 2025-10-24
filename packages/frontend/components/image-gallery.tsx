'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Trash2, Search, Tag, CheckCircle2, Circle } from 'lucide-react';
import type { GeneratedImage } from '@/types/content-workspace';

interface ImageGalleryProps {
  images: GeneratedImage[];
  selectedImages: GeneratedImage[];
  onImageSelected: (image: GeneratedImage, selected: boolean) => void;
  onImageRemoved: (imageId: string) => void;
}

export default function ImageGallery({
  images,
  selectedImages,
  onImageSelected,
  onImageRemoved
}: ImageGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = Array.from(
    new Set(images.flatMap(img => img.tags))
  );

  // Filter images
  const filteredImages = images.filter(img => {
    const matchesSearch =
      img.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.prompt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = !filterTag || img.tags.includes(filterTag);

    return matchesSearch && matchesTag;
  });

  const isSelected = (imageId: string) => {
    return selectedImages.some(img => img.id === imageId);
  };

  return (
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-purple-400" />
          Image Gallery ({images.length})
        </h3>
      </div>

      {/* Search and Filter */}
      <div className="mb-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by label or prompt..."
            className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterTag(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                !filterTag
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors ${
                  filterTag === tag
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Images Grid */}
      <div className="flex-1 overflow-y-auto">
        {filteredImages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">
              {images.length === 0 ? 'No images yet' : 'No matching images'}
            </p>
            <p className="text-sm mt-1">
              {images.length === 0
                ? 'Generate your first image to get started'
                : 'Try adjusting your search or filter'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 pb-4">
            {filteredImages.map(image => {
              const selected = isSelected(image.id);
              return (
                <div
                  key={image.id}
                  className={`group relative bg-white/5 rounded-lg border overflow-hidden transition-all cursor-pointer ${
                    selected
                      ? 'border-purple-400 ring-2 ring-purple-400/50'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                  onClick={() => onImageSelected(image, !selected)}
                >
                  {/* Selection Indicator */}
                  <div className="absolute top-2 left-2 z-10">
                    {selected ? (
                      <CheckCircle2 className="w-6 h-6 text-purple-400 fill-purple-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this image?')) {
                        onImageRemoved(image.id);
                      }
                    }}
                    className="absolute top-2 right-2 z-10 p-1.5 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>

                  {/* Image */}
                  <img
                    src={image.url}
                    alt={image.label}
                    className="w-full h-40 object-cover"
                  />

                  {/* Info Overlay */}
                  <div className="p-3">
                    <p className="text-sm font-medium text-white mb-1 truncate">
                      {image.label}
                    </p>

                    {/* Tags */}
                    {image.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {image.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-purple-600/20 border border-purple-400/30 rounded text-xs text-purple-300"
                          >
                            {tag}
                          </span>
                        ))}
                        {image.tags.length > 3 && (
                          <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-400">
                            +{image.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-gray-400 line-clamp-2">
                      {image.prompt}
                    </p>

                    {/* Metadata */}
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(image.createdAt).toLocaleDateString()}
                      </span>
                      {image.firestoreUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(image.firestoreUrl!);
                            alert('URL copied to clipboard!');
                          }}
                          className="text-xs text-purple-400 hover:text-purple-300"
                        >
                          Copy URL
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selection Summary */}
      {selectedImages.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-sm text-gray-300">
            {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected for content creation
          </p>
        </div>
      )}
    </div>
  );
}
