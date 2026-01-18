import React, { useState, useEffect } from 'react';
import { Image, Film, Music, FileText, Upload, Search, Grid, List, FolderOpen, Sparkles } from 'lucide-react';
import { WorkspaceContext } from '../../hooks/useClaudeContext';

interface MediaPoolProps {
  onContextUpdate: (context: WorkspaceContext) => void;
}

type MediaType = 'all' | 'image' | 'video' | 'audio' | 'document';
type ViewMode = 'grid' | 'list';

interface MediaAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size: string;
  dimensions?: string;
  duration?: string;
  thumbnail?: string;
  createdAt: string;
  tags: string[];
}

export default function MediaPool({ onContextUpdate }: MediaPoolProps) {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [filter, setFilter] = useState<MediaType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const [assets] = useState<MediaAsset[]>([
    { id: 'asset-1', name: 'intro-background.png', type: 'image', size: '2.4 MB', dimensions: '1920x1080', createdAt: '2024-01-15', tags: ['background', 'intro'], thumbnail: 'bg-gradient-to-br from-blue-500 to-purple-600' },
    { id: 'asset-2', name: 'lesson-thumbnail.png', type: 'image', size: '856 KB', dimensions: '1280x720', createdAt: '2024-01-14', tags: ['thumbnail', 'lesson'], thumbnail: 'bg-gradient-to-br from-green-500 to-teal-600' },
    { id: 'asset-3', name: 'whiteboard-animation.mp4', type: 'video', size: '15.2 MB', duration: '2:34', createdAt: '2024-01-13', tags: ['animation', 'whiteboard'], thumbnail: 'bg-gradient-to-br from-red-500 to-orange-600' },
    { id: 'asset-4', name: 'background-music.mp3', type: 'audio', size: '4.8 MB', duration: '3:45', createdAt: '2024-01-12', tags: ['music', 'background'], thumbnail: 'bg-gradient-to-br from-purple-500 to-pink-600' },
    { id: 'asset-5', name: 'narrator-voice.mp3', type: 'audio', size: '2.1 MB', duration: '1:23', createdAt: '2024-01-11', tags: ['voice', 'narration'], thumbnail: 'bg-gradient-to-br from-yellow-500 to-orange-600' },
    { id: 'asset-6', name: 'lesson-script.md', type: 'document', size: '12 KB', createdAt: '2024-01-10', tags: ['script', 'lesson'], thumbnail: 'bg-gradient-to-br from-gray-500 to-gray-700' },
    { id: 'asset-7', name: 'circle-theorem.png', type: 'image', size: '1.2 MB', dimensions: '1080x1080', createdAt: '2024-01-09', tags: ['math', 'theorem', 'diagram'], thumbnail: 'bg-gradient-to-br from-cyan-500 to-blue-600' },
    { id: 'asset-8', name: 'venn-diagram.mp4', type: 'video', size: '8.4 MB', duration: '0:45', createdAt: '2024-01-08', tags: ['animation', 'math', 'sets'], thumbnail: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
  ]);

  // Filter assets
  const filteredAssets = assets.filter(asset => {
    const matchesFilter = filter === 'all' || asset.type === filter;
    const matchesSearch = searchQuery === '' ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Update context
  useEffect(() => {
    const asset = assets.find(a => a.id === selectedAsset);

    onContextUpdate({
      workspace: 'media-pool',
      activeItem: asset ? {
        id: asset.id,
        name: asset.name,
        type: asset.type,
      } : undefined,
      metadata: {
        totalAssets: assets.length,
        filteredAssets: filteredAssets.length,
        currentFilter: filter,
        searchQuery: searchQuery || undefined,
        selectedAsset: asset?.name,
        selectedAssetType: asset?.type,
        selectedAssetSize: asset?.size,
        assetsByType: {
          images: assets.filter(a => a.type === 'image').length,
          videos: assets.filter(a => a.type === 'video').length,
          audio: assets.filter(a => a.type === 'audio').length,
          documents: assets.filter(a => a.type === 'document').length,
        },
      },
    });
  }, [selectedAsset, filter, searchQuery, assets, filteredAssets, onContextUpdate]);

  const getTypeIcon = (type: MediaAsset['type']) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Film className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: MediaAsset['type']) => {
    switch (type) {
      case 'image': return 'text-blue-400';
      case 'video': return 'text-red-400';
      case 'audio': return 'text-purple-400';
      case 'document': return 'text-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col bg-studio-bg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-studio-border bg-studio-card/50">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-workspace-media" />
          <span className="font-ui text-sm text-studio-text">Media Pool</span>
          <span className="text-xs text-studio-muted">{assets.length} assets</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary text-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Generate
          </button>
          <button className="btn btn-primary text-xs flex items-center gap-1">
            <Upload className="w-3 h-3" />
            Upload
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-studio-border bg-studio-card/30">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-studio-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets..."
            className="w-full pl-9 pr-3 py-1.5 bg-studio-bg border border-studio-border rounded text-sm text-studio-text focus:outline-none focus:border-workspace-media"
          />
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-1">
          {(['all', 'image', 'video', 'audio', 'document'] as MediaType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                filter === type
                  ? 'bg-workspace-media/20 text-workspace-media border border-workspace-media/50'
                  : 'bg-studio-card border border-studio-border text-studio-muted hover:text-studio-text'
              }`}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-studio-card text-studio-text' : 'text-studio-muted hover:text-studio-text'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-studio-card text-studio-text' : 'text-studio-muted hover:text-studio-text'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Asset Grid/List */}
        <div className="flex-1 p-4 overflow-y-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-4 gap-4">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset.id)}
                  className={`group cursor-pointer rounded-lg overflow-hidden border transition-all ${
                    selectedAsset === asset.id
                      ? 'border-workspace-media ring-2 ring-workspace-media/30'
                      : 'border-studio-border hover:border-studio-border/80'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className={`aspect-video ${asset.thumbnail} flex items-center justify-center`}>
                    <div className={`${getTypeColor(asset.type)} opacity-50 group-hover:opacity-100 transition-opacity`}>
                      {React.cloneElement(getTypeIcon(asset.type), { className: 'w-8 h-8' })}
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-2 bg-studio-card">
                    <p className="text-xs text-studio-text truncate">{asset.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`${getTypeColor(asset.type)}`}>{getTypeIcon(asset.type)}</span>
                      <span className="text-[10px] text-studio-muted">{asset.size}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset.id)}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-all ${
                    selectedAsset === asset.id
                      ? 'bg-workspace-media/20 border border-workspace-media/50'
                      : 'hover:bg-studio-card/50 border border-transparent'
                  }`}
                >
                  <div className={`w-10 h-10 rounded ${asset.thumbnail} flex items-center justify-center`}>
                    <span className={`${getTypeColor(asset.type)}`}>{getTypeIcon(asset.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-studio-text truncate">{asset.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-studio-muted">
                      <span>{asset.type}</span>
                      <span>•</span>
                      <span>{asset.size}</span>
                      {asset.duration && <><span>•</span><span>{asset.duration}</span></>}
                    </div>
                  </div>
                  <span className="text-xs text-studio-muted">{asset.createdAt}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Asset Details */}
        {selectedAsset && (
          <div className="w-72 border-l border-studio-border p-4 overflow-y-auto">
            {(() => {
              const asset = assets.find(a => a.id === selectedAsset);
              if (!asset) return null;

              return (
                <div>
                  {/* Preview */}
                  <div className={`aspect-video rounded-lg ${asset.thumbnail} flex items-center justify-center mb-4`}>
                    <span className={`${getTypeColor(asset.type)}`}>
                      {React.cloneElement(getTypeIcon(asset.type), { className: 'w-12 h-12' })}
                    </span>
                  </div>

                  <h3 className="font-medium text-studio-text mb-2">{asset.name}</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-studio-muted">Type</span>
                      <span className={`${getTypeColor(asset.type)} capitalize`}>{asset.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-studio-muted">Size</span>
                      <span className="text-studio-text">{asset.size}</span>
                    </div>
                    {asset.dimensions && (
                      <div className="flex justify-between">
                        <span className="text-studio-muted">Dimensions</span>
                        <span className="text-studio-text">{asset.dimensions}</span>
                      </div>
                    )}
                    {asset.duration && (
                      <div className="flex justify-between">
                        <span className="text-studio-muted">Duration</span>
                        <span className="text-studio-text">{asset.duration}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-studio-muted">Created</span>
                      <span className="text-studio-text">{asset.createdAt}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-4">
                    <span className="text-xs text-studio-muted">Tags</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {asset.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-studio-card border border-studio-border rounded text-xs text-studio-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 space-y-2">
                    <button className="w-full btn btn-primary text-xs">
                      Add to Timeline
                    </button>
                    <button className="w-full btn btn-secondary text-xs">
                      Download
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1 border-t border-studio-border bg-studio-card/30 text-xs text-studio-muted">
        <span>
          Showing {filteredAssets.length} of {assets.length} assets
          {filter !== 'all' && ` (filtered: ${filter})`}
        </span>
        <span>Total size: {assets.reduce((acc, a) => acc + parseFloat(a.size), 0).toFixed(1)} MB</span>
      </div>
    </div>
  );
}
