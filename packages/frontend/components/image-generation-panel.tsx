'use client';

import React, { useState, useRef } from 'react';
import { Upload, Wand2, X, Loader2, Check, RefreshCw, Image as ImageIcon } from 'lucide-react';
import type { GeneratedImage } from '@/types/content-workspace';

interface ImageGenerationPanelProps {
  onImageGenerated: (image: GeneratedImage) => void;
  onImageAccepted: (image: GeneratedImage) => void;
}

export default function ImageGenerationPanel({
  onImageGenerated,
  onImageAccepted
}: ImageGenerationPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageLabel, setImageLabel] = useState('');
  const [imageTags, setImageTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      const url = URL.createObjectURL(file);
      setUploadedImageUrl(url);
    }
  };

  const handleRemoveUpload = () => {
    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl);
    }
    setUploadedImage(null);
    setUploadedImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && !uploadedImage) {
      return;
    }

    setIsGenerating(true);
    setGeneratedImageUrl(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const formData = new FormData();
      formData.append('prompt', prompt);
      if (uploadedImage) {
        formData.append('image', uploadedImage);
      }

      const response = await fetch(`${apiUrl}/api/images/generate`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Image generation failed');
      }

      const data = await response.json();
      setGeneratedImageUrl(data.imageUrl);

      // Auto-generate label from prompt
      if (!imageLabel && prompt) {
        const autoLabel = prompt.slice(0, 50) + (prompt.length > 50 ? '...' : '');
        setImageLabel(autoLabel);
      }
    } catch (error) {
      console.error('Image generation error:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFollowUp = async (followUpPrompt: string) => {
    if (!followUpPrompt.trim() || !generatedImageUrl) return;

    setIsGenerating(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      // Convert data URL to blob
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('prompt', followUpPrompt);
      // Send the previous image as a file for refinement
      formData.append('image', blob, 'previous-image.png');

      const apiResponse = await fetch(`${apiUrl}/api/images/generate`, {
        method: 'POST',
        body: formData
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Image refinement failed');
      }

      const data = await apiResponse.json();
      setGeneratedImageUrl(data.imageUrl);
      setPrompt(followUpPrompt);
    } catch (error) {
      console.error('Image refinement error:', error);
      alert(`Failed to refine image: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptImage = async () => {
    if (!generatedImageUrl) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      // Save to Firestore Storage
      const response = await fetch(`${apiUrl}/api/images/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: generatedImageUrl,
          label: imageLabel || 'Untitled',
          tags: imageTags,
          prompt: prompt
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save image');
      }

      const data = await response.json();

      const image: GeneratedImage = {
        id: data.id,
        url: generatedImageUrl,
        label: imageLabel || 'Untitled',
        tags: imageTags,
        prompt: prompt,
        createdAt: new Date().toISOString(),
        firestoreUrl: data.firestoreUrl
      };

      onImageAccepted(image);

      // Reset for next generation
      setGeneratedImageUrl(null);
      setPrompt('');
      setImageLabel('');
      setImageTags([]);
      handleRemoveUpload();
    } catch (error) {
      console.error('Save image error:', error);
      alert('Failed to save image. Please try again.');
    }
  };

  const handleReject = () => {
    setGeneratedImageUrl(null);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !imageTags.includes(tagInput.trim())) {
      setImageTags([...imageTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setImageTags(imageTags.filter(t => t !== tag));
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Input Section */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-purple-400" />
          Generate Image
        </h3>

        {/* Upload Image */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload Reference Image (Optional)
          </label>
          <div className="relative">
            {uploadedImageUrl ? (
              <div className="relative group">
                <img
                  src={uploadedImageUrl}
                  alt="Uploaded reference"
                  className="w-full h-48 object-cover rounded-lg border border-white/10"
                />
                <button
                  onClick={handleRemoveUpload}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Click to upload an image</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Prompt Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Prompt {!uploadedImage && <span className="text-red-400">*</span>}
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 resize-none"
            rows={4}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || (!prompt.trim() && !uploadedImage)}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate Image
            </>
          )}
        </button>
      </div>

      {/* Generated Image Display */}
      {generatedImageUrl && (
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 flex-1 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Generated Image</h3>

          <img
            src={generatedImageUrl}
            alt="Generated"
            className="w-full rounded-lg border border-white/10 mb-4"
          />

          {/* Label and Tags */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Label <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={imageLabel}
              onChange={(e) => setImageLabel(e.target.value)}
              placeholder="Enter a label for this image"
              className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add a tag and press Enter"
                className="flex-1 px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {imageTags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-purple-600/20 border border-purple-400/30 rounded-full text-sm text-purple-300 flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAcceptImage}
              disabled={!imageLabel.trim()}
              className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Accept & Save
            </button>
            <button
              onClick={handleReject}
              className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Reject
            </button>
          </div>

          {/* Follow-up Prompt - Image Refinement */}
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="w-4 h-4 text-blue-400" />
              <label className="block text-sm font-semibold text-blue-300">
                Refine This Image
              </label>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Describe changes to make to the current image. Examples: "Make it brighter", "Add soft shadows", "Change to warmer colors"
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., Make it brighter and add soft shadows..."
                disabled={isGenerating}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isGenerating) {
                    handleFollowUp((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
                className="flex-1 px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 disabled:opacity-50"
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  if (input.value.trim()) {
                    handleFollowUp(input.value);
                    input.value = '';
                  }
                }}
                disabled={isGenerating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {isGenerating ? 'Refining...' : 'Refine'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
