'use client';

/**
 * Video Editor - Claude-First Multi-Track Editor
 *
 * A visual editor for video composition with:
 * - Multi-track timeline (video, audio, overlays)
 * - Three selection modes: click clip, drag range, double-click properties
 * - Claude integration for AI-assisted editing
 * - Real video preview with playback sync
 * - File upload for videos/images/audio
 */

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Scissors,
  Trash2,
  Plus,
  Camera,
  MessageSquare,
  Layers,
  Volume2,
  VolumeX,
  Film,
  Image,
  Type,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  Upload,
  Download,
  Wand2,
  FolderOpen,
  X,
  Loader2
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface Clip {
  id: string;
  type: 'video' | 'image' | 'audio' | 'text';
  name: string;
  src: string;
  trackId: string;
  startFrame: number;
  durationFrames: number;
  trimStart: number;
  trimEnd: number;
  originalDuration: number;
  color: string;
  thumbnail?: string;
  properties?: {
    text?: string;
    fontSize?: number;
    fontColor?: string;
    transition?: string;
    volume?: number;
  };
}

interface Track {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'overlay';
  height: number;
  muted: boolean;
  locked: boolean;
}

interface TimelineSelection {
  type: 'clip' | 'range' | 'none';
  clipId?: string;
  startFrame?: number;
  endFrame?: number;
  trackIds?: string[];
}

interface ClaudeContext {
  selection: TimelineSelection;
  currentFrame: number;
  clips: Clip[];
  activeClip?: Clip;
  screenshot?: string;
}

interface MediaAsset {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio';
  src: string;
  duration?: number;
  thumbnail?: string;
}

// ============================================
// CONSTANTS
// ============================================

const FPS = 30;
const PIXELS_PER_FRAME = 3;
const DEFAULT_ZOOM = 1;

const TRACK_COLORS: Record<string, string> = {
  video: '#3b82f6',
  audio: '#10b981',
  overlay: '#f59e0b',
  image: '#8b5cf6',
  text: '#ec4899'
};

// ============================================
// INITIAL DATA
// ============================================

const INITIAL_TRACKS: Track[] = [
  { id: 'video-1', name: 'Video 1', type: 'video', height: 60, muted: false, locked: false },
  { id: 'video-2', name: 'Video 2', type: 'video', height: 60, muted: false, locked: false },
  { id: 'overlay', name: 'Overlays', type: 'overlay', height: 50, muted: false, locked: false },
  { id: 'audio-1', name: 'Audio', type: 'audio', height: 40, muted: false, locked: false },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

const frameToTime = (frame: number): string => {
  const totalSeconds = frame / FPS;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const frames = Math.round(frame % FPS);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${frames.toString().padStart(2, '0')}`;
};

const frameToSeconds = (frame: number): number => frame / FPS;
const secondsToFrame = (seconds: number): number => Math.round(seconds * FPS);

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const getClipColor = (type: string): string => {
  const colors: Record<string, string[]> = {
    video: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7'],
    image: ['#8b5cf6', '#a855f7', '#d946ef'],
    audio: ['#10b981', '#14b8a6', '#06b6d4'],
    text: ['#ec4899', '#f43f5e', '#f97316']
  };
  const typeColors = colors[type] || colors.video;
  return typeColors[Math.floor(Math.random() * typeColors.length)];
};

// ============================================
// VIDEO PREVIEW COMPONENT
// ============================================

interface VideoPreviewProps {
  clips: Clip[];
  currentFrame: number;
  isPlaying: boolean;
  onTimeUpdate: (frame: number) => void;
  onPlayToggle: (playing: boolean) => void;
  onLoadedMetadata: (clipId: string, duration: number) => void;
  selection: TimelineSelection;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  clips,
  currentFrame,
  isPlaying,
  onTimeUpdate,
  onPlayToggle,
  onLoadedMetadata,
  selection
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadedClips, setLoadedClips] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const lastClipIdRef = useRef<string | null>(null);

  // Find the active clip at current frame (highest layer video/image)
  const activeClip = useMemo(() => {
    const videoTracks = ['overlay', 'video-2', 'video-1']; // Check overlay first (top layer)
    for (const trackId of videoTracks) {
      const clip = clips.find(c =>
        c.trackId === trackId &&
        (c.type === 'video' || c.type === 'image') &&
        currentFrame >= c.startFrame &&
        currentFrame < c.startFrame + c.durationFrames
      );
      if (clip) return clip;
    }
    return null;
  }, [clips, currentFrame]);

  // Sync video playback with timeline
  useEffect(() => {
    const video = videoRef.current;
    if (!activeClip || activeClip.type !== 'video' || !video) return;

    const clipLocalFrame = currentFrame - activeClip.startFrame + activeClip.trimStart;
    const targetTime = frameToSeconds(clipLocalFrame);

    // Only seek if difference is significant (avoids stuttering)
    if (Math.abs(video.currentTime - targetTime) > 0.1) {
      video.currentTime = targetTime;
    }

    if (isPlaying && video.paused) {
      video.play().catch(() => {});
    } else if (!isPlaying && !video.paused) {
      video.pause();
    }
  }, [activeClip, currentFrame, isPlaying]);

  // Reset video when clip changes
  useEffect(() => {
    if (activeClip?.id !== lastClipIdRef.current) {
      lastClipIdRef.current = activeClip?.id || null;
      if (videoRef.current && activeClip?.type === 'video') {
        videoRef.current.load();
      }
    }
  }, [activeClip?.id, activeClip?.type]);

  // Handle video time updates during playback
  const handleVideoTimeUpdate = (clip: Clip) => {
    if (!isPlaying) return;
    const video = videoRef.current;
    if (!video) return;

    const newFrame = clip.startFrame + secondsToFrame(video.currentTime) - clip.trimStart;
    onTimeUpdate(newFrame);
  };

  const handleVideoLoaded = (clip: Clip, video: HTMLVideoElement) => {
    setLoadedClips(prev => new Set(prev).add(clip.id));
    const durationFrames = secondsToFrame(video.duration);
    onLoadedMetadata(clip.id, durationFrames);
  };

  const handleVideoError = (clip: Clip) => {
    setError(`Failed to load: ${clip.name}`);
    setTimeout(() => setError(null), 3000);
  };

  // Get text overlay clips at current frame
  const textOverlays = clips.filter(c =>
    c.type === 'text' &&
    currentFrame >= c.startFrame &&
    currentFrame < c.startFrame + c.durationFrames
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Video display */}
      {activeClip && activeClip.type === 'video' && (
        <video
          key={activeClip.id}
          ref={videoRef}
          src={activeClip.src}
          style={{ maxWidth: '100%', maxHeight: '100%', cursor: 'pointer' }}
          playsInline
          onClick={() => {
            // Click video to toggle play/pause
            onPlayToggle(!isPlaying);
          }}
          onPlay={() => {
            // Sync video play to timeline state
            if (!isPlaying) {
              onPlayToggle(true);
            }
          }}
          onPause={() => {
            // Sync video pause to timeline state
            if (isPlaying) {
              onPlayToggle(false);
            }
          }}
          onTimeUpdate={() => handleVideoTimeUpdate(activeClip)}
          onLoadedMetadata={(e) => {
            handleVideoLoaded(activeClip, e.currentTarget);
          }}
          onError={() => handleVideoError(activeClip)}
        />
      )}

      {/* Image display */}
      {activeClip && activeClip.type === 'image' && (
        <img
          src={activeClip.src}
          alt={activeClip.name}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          onError={() => handleVideoError(activeClip)}
        />
      )}

      {/* No clip placeholder */}
      {!activeClip && (
        <div style={{ textAlign: 'center', color: '#666' }}>
          <Film size={64} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p style={{ fontSize: '18px' }}>No clip at playhead</p>
          <p style={{ fontSize: '14px', marginTop: '4px' }}>Drop media files or use Import</p>
        </div>
      )}

      {/* Text overlays */}
      {textOverlays.map(clip => (
        <div
          key={clip.id}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/70 rounded-lg"
          style={{
            fontSize: `${clip.properties?.fontSize || 24}px`,
            color: clip.properties?.fontColor || 'white'
          }}
        >
          {clip.properties?.text || 'Text'}
        </div>
      ))}

      {/* Loading indicator for videos */}
      {activeClip?.type === 'video' && !loadedClips.has(activeClip.id) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="animate-spin text-white" size={32} />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Current clip info */}
      {activeClip && (
        <div className="absolute top-4 left-4 bg-zinc-900/80 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: activeClip.color }} />
          <span className="text-white">{activeClip.name}</span>
        </div>
      )}

      {/* Timecode overlay */}
      <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-1.5 rounded font-mono text-white text-sm">
        {frameToTime(currentFrame)}
      </div>

      {/* Selection indicator */}
      {selection.type === 'clip' && (
        <div className="absolute top-4 right-4 bg-indigo-600/90 px-3 py-1.5 rounded text-xs text-white">
          Clip Selected
        </div>
      )}
      {selection.type === 'range' && (
        <div className="absolute top-4 right-4 bg-blue-600/90 px-3 py-1.5 rounded text-xs text-white">
          Range: {frameToTime(selection.startFrame || 0)} - {frameToTime(selection.endFrame || 0)}
        </div>
      )}
    </div>
  );
};

// ============================================
// MEDIA BROWSER COMPONENT
// ============================================

interface MediaBrowserProps {
  assets: MediaAsset[];
  onAddAsset: (files: FileList) => void;
  onDragStart: (asset: MediaAsset) => void;
  onAddToTimeline: (asset: MediaAsset) => void;
  onClose: () => void;
}

const MediaBrowser: React.FC<MediaBrowserProps> = ({
  assets,
  onAddAsset,
  onDragStart,
  onAddToTimeline,
  onClose
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddAsset(e.target.files);
    }
  };

  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Media</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-white">
          <X size={16} />
        </button>
      </div>

      <div className="p-3 border-b border-zinc-800">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,image/*,audio/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm text-white"
        >
          <Upload size={16} />
          Import Files
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {assets.length === 0 ? (
          <div className="text-center text-zinc-500 py-8">
            <FolderOpen size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No media files</p>
            <p className="text-xs mt-1">Import videos, images, or audio</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {assets.map(asset => (
              <div
                key={asset.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify(asset));
                  e.dataTransfer.effectAllowed = 'copy';
                  onDragStart(asset);
                }}
                onDoubleClick={() => onAddToTimeline(asset)}
                className="bg-zinc-800 rounded-lg overflow-hidden cursor-grab hover:ring-2 hover:ring-indigo-500 transition-all group"
                title="Drag to track or double-click to add"
              >
                <div className="aspect-video bg-zinc-950 flex items-center justify-center relative">
                  {asset.thumbnail ? (
                    <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-zinc-600">
                      {asset.type === 'video' && <Film size={24} />}
                      {asset.type === 'image' && <Image size={24} />}
                      {asset.type === 'audio' && <Volume2 size={24} />}
                    </span>
                  )}
                  {/* Add button overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToTimeline(asset);
                      }}
                      className="p-2 bg-indigo-600 rounded-full hover:bg-indigo-500"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs text-zinc-300 truncate">{asset.name}</p>
                  <p className="text-xs text-zinc-500">
                    {asset.duration ? frameToTime(asset.duration) : asset.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// CLIP COMPONENT
// ============================================

interface ClipComponentProps {
  clip: Clip;
  isSelected: boolean;
  zoom: number;
  onSelect: (clip: Clip, mode: 'click' | 'double-click') => void;
  onDragStart: (clip: Clip, e: React.MouseEvent) => void;
  onTrimStart: (clip: Clip, handle: 'left' | 'right', e: React.MouseEvent) => void;
}

const ClipComponent: React.FC<ClipComponentProps> = ({
  clip,
  isSelected,
  zoom,
  onSelect,
  onDragStart,
  onTrimStart
}) => {
  const width = clip.durationFrames * PIXELS_PER_FRAME * zoom;
  const left = clip.startFrame * PIXELS_PER_FRAME * zoom;

  const getIcon = () => {
    switch (clip.type) {
      case 'video': return <Film size={14} />;
      case 'image': return <Image size={14} />;
      case 'audio': return <Volume2 size={14} />;
      case 'text': return <Type size={14} />;
      default: return <Film size={14} />;
    }
  };

  return (
    <div
      className={`absolute top-1 bottom-1 rounded cursor-pointer transition-all group ${
        isSelected ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent z-10' : ''
      }`}
      style={{
        left: `${left}px`,
        width: `${Math.max(30, width)}px`,
        backgroundColor: clip.color,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(clip, 'click');
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onSelect(clip, 'double-click');
      }}
      onMouseDown={(e) => {
        if (e.button === 0 && !(e.target as HTMLElement).closest('.trim-handle')) {
          onDragStart(clip, e);
        }
      }}
    >
      {/* Thumbnail background for video/image */}
      {clip.thumbnail && (
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center rounded"
          style={{ backgroundImage: `url(${clip.thumbnail})` }}
        />
      )}

      {/* Left trim handle */}
      <div
        className="trim-handle absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white/0 hover:bg-white/40 group-hover:bg-white/20 rounded-l transition-colors"
        onMouseDown={(e) => {
          e.stopPropagation();
          onTrimStart(clip, 'left', e);
        }}
      />

      {/* Clip content */}
      <div className="px-3 py-1 flex items-center gap-2 overflow-hidden h-full relative z-10">
        <span className="text-white/80">{getIcon()}</span>
        <span className="text-xs text-white font-medium truncate drop-shadow">
          {clip.name}
        </span>
      </div>

      {/* Right trim handle */}
      <div
        className="trim-handle absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white/0 hover:bg-white/40 group-hover:bg-white/20 rounded-r transition-colors"
        onMouseDown={(e) => {
          e.stopPropagation();
          onTrimStart(clip, 'right', e);
        }}
      />

      {/* Waveform visualization for audio */}
      {clip.type === 'audio' && (
        <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
          <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
            {Array.from({ length: 50 }).map((_, i) => (
              <rect
                key={i}
                x={i * 2}
                y={15 - Math.random() * 12}
                width="1.5"
                height={Math.random() * 24 + 3}
                fill="white"
              />
            ))}
          </svg>
        </div>
      )}
    </div>
  );
};

// ============================================
// TRACK COMPONENT
// ============================================

interface TrackComponentProps {
  track: Track;
  clips: Clip[];
  selection: TimelineSelection;
  zoom: number;
  totalFrames: number;
  onSelectClip: (clip: Clip, mode: 'click' | 'double-click') => void;
  onDragClip: (clip: Clip, e: React.MouseEvent) => void;
  onTrimClip: (clip: Clip, handle: 'left' | 'right', e: React.MouseEvent) => void;
  onRangeSelect: (trackId: string, e: React.MouseEvent) => void;
  onDropAsset: (trackId: string, frame: number, asset: MediaAsset) => void;
  onToggleMute: (trackId: string) => void;
}

const TrackComponent: React.FC<TrackComponentProps> = ({
  track,
  clips,
  selection,
  zoom,
  totalFrames,
  onSelectClip,
  onDragClip,
  onTrimClip,
  onRangeSelect,
  onDropAsset,
  onToggleMute
}) => {
  const trackWidth = totalFrames * PIXELS_PER_FRAME * zoom;
  const [isDragOver, setIsDragOver] = useState(false);

  const getTrackIcon = () => {
    switch (track.type) {
      case 'video': return <Film size={16} />;
      case 'audio': return <Volume2 size={16} />;
      case 'overlay': return <Layers size={16} />;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const frame = Math.round(x / (PIXELS_PER_FRAME * zoom));

    // Get dragged asset from dataTransfer
    const assetData = e.dataTransfer.getData('application/json');
    if (assetData) {
      const asset = JSON.parse(assetData) as MediaAsset;
      onDropAsset(track.id, frame, asset);
    }
  };

  return (
    <div className="flex border-b border-zinc-800">
      {/* Track header */}
      <div
        className="w-48 flex-shrink-0 px-3 py-2 bg-zinc-900 border-r border-zinc-800 flex items-center gap-2"
        style={{ height: `${track.height}px` }}
      >
        <span className="text-zinc-400">{getTrackIcon()}</span>
        <span className="text-sm text-zinc-300 truncate flex-1">{track.name}</span>
        <button
          onClick={() => onToggleMute(track.id)}
          className={`p-1 rounded transition-colors ${
            track.muted
              ? 'bg-red-500/20 text-red-400'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
          title={track.muted ? 'Unmute' : 'Mute'}
        >
          {track.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>

      {/* Track content */}
      <div
        className={`flex-1 relative overflow-hidden transition-colors ${
          isDragOver ? 'bg-indigo-500/20' : 'bg-zinc-950/50'
        }`}
        style={{ height: `${track.height}px`, minWidth: `${trackWidth}px` }}
        onMouseDown={(e) => onRangeSelect(track.id, e)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: Math.ceil(totalFrames / FPS) }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-zinc-800/50"
              style={{ left: `${i * FPS * PIXELS_PER_FRAME * zoom}px` }}
            />
          ))}
        </div>

        {/* Range selection highlight */}
        {selection.type === 'range' && selection.trackIds?.includes(track.id) && (
          <div
            className="absolute top-0 bottom-0 bg-blue-500/20 border-x-2 border-blue-500"
            style={{
              left: `${(selection.startFrame || 0) * PIXELS_PER_FRAME * zoom}px`,
              width: `${((selection.endFrame || 0) - (selection.startFrame || 0)) * PIXELS_PER_FRAME * zoom}px`
            }}
          />
        )}

        {/* Clips */}
        {clips.map(clip => (
          <ClipComponent
            key={clip.id}
            clip={clip}
            isSelected={selection.type === 'clip' && selection.clipId === clip.id}
            zoom={zoom}
            onSelect={onSelectClip}
            onDragStart={onDragClip}
            onTrimStart={onTrimClip}
          />
        ))}

        {/* Drop indicator */}
        {isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-indigo-400 text-sm font-medium">Drop here</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// PROPERTIES PANEL
// ============================================

interface PropertiesPanelProps {
  clip: Clip | null;
  onUpdate: (clipId: string, updates: Partial<Clip>) => void;
  onClose: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ clip, onUpdate, onClose }) => {
  if (!clip) return null;

  return (
    <div className="w-72 bg-zinc-900 border-l border-zinc-800 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Clip Properties</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-white">
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Name</label>
          <input
            type="text"
            value={clip.name}
            onChange={(e) => onUpdate(clip.id, { name: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white"
          />
        </div>

        {/* Timing */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Start</label>
            <input
              type="text"
              value={frameToTime(clip.startFrame)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white font-mono"
              readOnly
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Duration</label>
            <input
              type="text"
              value={frameToTime(clip.durationFrames)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white font-mono"
              readOnly
            />
          </div>
        </div>

        {/* Type-specific properties */}
        {clip.type === 'text' && (
          <>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Text</label>
              <textarea
                value={clip.properties?.text || ''}
                onChange={(e) => onUpdate(clip.id, {
                  properties: { ...clip.properties, text: e.target.value }
                })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white resize-none"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Font Size</label>
              <input
                type="number"
                value={clip.properties?.fontSize || 24}
                onChange={(e) => onUpdate(clip.id, {
                  properties: { ...clip.properties, fontSize: parseInt(e.target.value) }
                })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white"
              />
            </div>
          </>
        )}

        {(clip.type === 'audio' || clip.type === 'video') && (
          <div>
            <label className="block text-xs text-zinc-400 mb-1">
              Volume: {clip.properties?.volume || 100}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={clip.properties?.volume || 100}
              onChange={(e) => onUpdate(clip.id, {
                properties: { ...clip.properties, volume: parseInt(e.target.value) }
              })}
              className="w-full"
            />
          </div>
        )}

        {/* Transition */}
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Transition In</label>
          <select
            value={clip.properties?.transition || 'none'}
            onChange={(e) => onUpdate(clip.id, {
              properties: { ...clip.properties, transition: e.target.value }
            })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white"
          >
            <option value="none">None</option>
            <option value="fade">Fade</option>
            <option value="slideLeft">Slide Left</option>
            <option value="slideRight">Slide Right</option>
            <option value="zoomIn">Zoom In</option>
            <option value="wipeLeft">Wipe Left</option>
            <option value="circleWipe">Circle Wipe</option>
            <option value="blur">Blur</option>
          </select>
        </div>

        {/* Source */}
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Source</label>
          <p className="text-xs text-zinc-500 truncate">{clip.src || 'No source'}</p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// CLAUDE CONTEXT PANEL
// ============================================

interface ClaudeContextPanelProps {
  context: ClaudeContext;
  onSendToClaude: (message: string) => void;
  onScreenshot: () => void;
}

const ClaudeContextPanel: React.FC<ClaudeContextPanelProps> = ({
  context,
  onSendToClaude,
  onScreenshot
}) => {
  const [message, setMessage] = useState('');

  const getSelectionDescription = () => {
    if (context.selection.type === 'none') {
      return context.activeClip ? `At: ${context.activeClip.name}` : 'No selection';
    }
    if (context.selection.type === 'clip') {
      const clip = context.clips.find(c => c.id === context.selection.clipId);
      return clip ? `Clip: ${clip.name} (${clip.type})` : 'Clip selected';
    }
    if (context.selection.type === 'range') {
      const start = frameToTime(context.selection.startFrame || 0);
      const end = frameToTime(context.selection.endFrame || 0);
      return `Range: ${start} → ${end}`;
    }
    return 'Unknown selection';
  };

  const handleSend = () => {
    if (message.trim()) {
      onSendToClaude(message);
      setMessage('');
    }
  };

  return (
    <div className="bg-zinc-900 border-t border-zinc-800 p-4">
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <Wand2 size={18} className="text-indigo-400" />
          <span className="text-sm font-medium text-white">Claude Context</span>
        </div>
        <div className="flex-1 text-sm text-zinc-400">
          {getSelectionDescription()}
        </div>
        <div className="text-sm text-zinc-500 font-mono">
          {frameToTime(context.currentFrame)}
        </div>
        <button
          onClick={onScreenshot}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-sm text-white transition-colors"
        >
          <Camera size={14} />
          Screenshot
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Tell Claude what to adjust... (e.g., 'Trim 2 seconds from the start')"
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-white flex items-center gap-2 transition-colors"
        >
          <MessageSquare size={16} />
          Send
        </button>
      </div>
    </div>
  );
};

// ============================================
// MAIN VIDEO EDITOR COMPONENT
// ============================================

export default function VideoEditorPage() {
  // State
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [clips, setClips] = useState<Clip[]>([]);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [selection, setSelection] = useState<TimelineSelection>({ type: 'none' });
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [showProperties, setShowProperties] = useState(false);
  const [showMediaBrowser, setShowMediaBrowser] = useState(true);
  const [selectedClipForProps, setSelectedClipForProps] = useState<Clip | null>(null);
  const [draggedAsset, setDraggedAsset] = useState<MediaAsset | null>(null);

  // In/Out point markers for range editing
  const [inPoint, setInPoint] = useState<number | null>(null);
  const [outPoint, setOutPoint] = useState<number | null>(null);
  const [editMessage, setEditMessage] = useState<string | null>(null);

  // Refs
  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const rangeStartRef = useRef<{ frame: number; trackId: string } | null>(null);

  // Calculate total duration
  const totalFrames = useMemo(() => Math.max(
    ...clips.map(c => c.startFrame + c.durationFrames),
    FPS * 60 // Minimum 1 minute
  ), [clips]);

  // Find active clip at current frame
  const activeClip = useMemo(() => {
    const videoTracks = ['video-1', 'video-2', 'overlay'];
    for (const trackId of [...videoTracks].reverse()) {
      const clip = clips.find(c =>
        c.trackId === trackId &&
        (c.type === 'video' || c.type === 'image') &&
        currentFrame >= c.startFrame &&
        currentFrame < c.startFrame + c.durationFrames
      );
      if (clip) return clip;
    }
    return null;
  }, [clips, currentFrame]);

  // Playback animation
  useEffect(() => {
    if (isPlaying) {
      let lastTime = performance.now();

      const animate = (time: number) => {
        const delta = time - lastTime;
        lastTime = time;

        setCurrentFrame(prev => {
          const next = prev + (delta / 1000) * FPS;
          if (next >= totalFrames) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, totalFrames]);

  // Handle file import
  const handleAddAsset = useCallback((files: FileList) => {
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video/') ? 'video' :
                   file.type.startsWith('audio/') ? 'audio' : 'image';

      const asset: MediaAsset = {
        id: generateId(),
        name: file.name,
        type,
        src: url
      };

      // Generate thumbnail for video
      if (type === 'video') {
        const video = document.createElement('video');
        video.src = url;
        video.onloadeddata = () => {
          video.currentTime = 1;
        };
        video.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 160;
          canvas.height = 90;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0, 160, 90);
          asset.thumbnail = canvas.toDataURL();
          asset.duration = secondsToFrame(video.duration);
          setAssets(prev => [...prev.filter(a => a.id !== asset.id), asset]);
        };
      } else if (type === 'image') {
        asset.thumbnail = url;
        asset.duration = FPS * 5; // Default 5 seconds for images
      }

      setAssets(prev => [...prev, asset]);
    });
  }, []);

  // Handle asset drag start
  const handleAssetDragStart = useCallback((asset: MediaAsset) => {
    setDraggedAsset(asset);
  }, []);

  // Handle adding asset directly to timeline (double-click or + button)
  const handleAddToTimeline = useCallback((asset: MediaAsset) => {
    // Determine which track to use based on asset type
    const trackId = asset.type === 'audio' ? 'audio-1' : 'video-1';

    // Add at current playhead position
    const newClip: Clip = {
      id: generateId(),
      type: asset.type,
      name: asset.name,
      src: asset.src,
      trackId,
      startFrame: Math.round(currentFrame),
      durationFrames: asset.duration || FPS * 5,
      trimStart: 0,
      trimEnd: 0,
      originalDuration: asset.duration || FPS * 5,
      color: getClipColor(asset.type),
      thumbnail: asset.thumbnail
    };

    setClips(prev => [...prev, newClip]);
  }, [currentFrame]);

  // Handle drop asset on track
  const handleDropAsset = useCallback((trackId: string, frame: number, asset: MediaAsset) => {
    const newClip: Clip = {
      id: generateId(),
      type: asset.type,
      name: asset.name,
      src: asset.src,
      trackId,
      startFrame: Math.max(0, frame),
      durationFrames: asset.duration || FPS * 5,
      trimStart: 0,
      trimEnd: 0,
      originalDuration: asset.duration || FPS * 5,
      color: getClipColor(asset.type),
      thumbnail: asset.thumbnail
    };

    setClips(prev => [...prev, newClip]);
    setDraggedAsset(null);
  }, []);

  // Selection handlers
  const handleSelectClip = useCallback((clip: Clip, mode: 'click' | 'double-click') => {
    if (mode === 'click') {
      setSelection({ type: 'clip', clipId: clip.id });
      setShowProperties(false);
    } else {
      setSelection({ type: 'clip', clipId: clip.id });
      setSelectedClipForProps(clip);
      setShowProperties(true);
    }
  }, []);

  const handleRangeSelect = useCallback((trackId: string, e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const frame = Math.round(x / (PIXELS_PER_FRAME * zoom));

    rangeStartRef.current = { frame, trackId };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.clientX - rect.left;
      const currentFrame = Math.round(currentX / (PIXELS_PER_FRAME * zoom));

      const startFrame = Math.min(rangeStartRef.current!.frame, currentFrame);
      const endFrame = Math.max(rangeStartRef.current!.frame, currentFrame);

      setSelection({
        type: 'range',
        startFrame,
        endFrame,
        trackIds: [trackId]
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      rangeStartRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [zoom]);

  // Clip manipulation
  const handleDragClip = useCallback((clip: Clip, e: React.MouseEvent) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startFrame = clip.startFrame;
    const startTrackId = clip.trackId;

    // Track heights for calculating which track we're over
    const trackHeights = tracks.map(t => t.height);
    const trackIds = tracks.map(t => t.id);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const deltaFrames = Math.round(deltaX / (PIXELS_PER_FRAME * zoom));
      const newStart = Math.max(0, startFrame + deltaFrames);

      // Calculate which track based on vertical movement
      let newTrackId = startTrackId;
      const startTrackIndex = trackIds.indexOf(startTrackId);

      if (Math.abs(deltaY) > 30) { // Threshold for track change
        // Calculate cumulative track heights to determine which track
        let accumulatedHeight = 0;
        const trackThreshold = 30; // pixels to move to change track

        if (deltaY > 0) {
          // Moving down
          for (let i = startTrackIndex + 1; i < trackIds.length; i++) {
            accumulatedHeight += trackHeights[i - 1];
            if (deltaY > accumulatedHeight - trackThreshold) {
              newTrackId = trackIds[i];
            }
          }
        } else {
          // Moving up
          for (let i = startTrackIndex - 1; i >= 0; i--) {
            accumulatedHeight += trackHeights[i + 1];
            if (-deltaY > accumulatedHeight - trackThreshold) {
              newTrackId = trackIds[i];
            }
          }
        }
      }

      setClips(prev => prev.map(c =>
        c.id === clip.id ? { ...c, startFrame: newStart, trackId: newTrackId } : c
      ));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [zoom, tracks]);

  const handleTrimClip = useCallback((clip: Clip, handle: 'left' | 'right', e: React.MouseEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startFrame = clip.startFrame;
    const startDuration = clip.durationFrames;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaFrames = Math.round(deltaX / (PIXELS_PER_FRAME * zoom));

      if (handle === 'left') {
        const newStart = Math.max(0, startFrame + deltaFrames);
        const newDuration = Math.max(FPS / 2, startDuration - deltaFrames);
        setClips(prev => prev.map(c =>
          c.id === clip.id ? {
            ...c,
            startFrame: newStart,
            durationFrames: newDuration,
            trimStart: Math.max(0, clip.trimStart + deltaFrames)
          } : c
        ));
      } else {
        const newDuration = Math.max(FPS / 2, startDuration + deltaFrames);
        setClips(prev => prev.map(c =>
          c.id === clip.id ? {
            ...c,
            durationFrames: newDuration,
            trimEnd: Math.max(0, clip.trimEnd - deltaFrames)
          } : c
        ));
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [zoom]);

  // Toggle track mute
  const handleToggleMute = useCallback((trackId: string) => {
    setTracks(prev => prev.map(t =>
      t.id === trackId ? { ...t, muted: !t.muted } : t
    ));
  }, []);

  // Update clip from video metadata
  const handleClipMetadataLoaded = useCallback((clipId: string, duration: number) => {
    setClips(prev => prev.map(c =>
      c.id === clipId && c.originalDuration !== duration
        ? { ...c, durationFrames: duration, originalDuration: duration }
        : c
    ));
  }, []);

  // Claude integration
  const handleSendToClaude = useCallback((message: string) => {
    const context: ClaudeContext = {
      selection,
      currentFrame: Math.round(currentFrame),
      clips,
      activeClip: activeClip || undefined
    };

    // TODO: Integrate with studio-bridge WebSocket
    alert(`Sent to Claude:\n\n"${message}"\n\nContext:\n- Selection: ${JSON.stringify(selection)}\n- Frame: ${Math.round(currentFrame)}\n- Active: ${activeClip?.name || 'none'}`);
  }, [selection, currentFrame, clips, activeClip]);

  const handleScreenshot = useCallback(() => {
    // TODO: Implement with html2canvas
    alert('Screenshot captured! (Integration pending)');
  }, []);

  // Cut clip at playhead position
  const handleCutAtPlayhead = useCallback(() => {
    const frame = Math.round(currentFrame);

    // Find all clips that span the playhead
    const clipsAtPlayhead = clips.filter(clip =>
      frame > clip.startFrame &&
      frame < clip.startFrame + clip.durationFrames
    );

    if (clipsAtPlayhead.length === 0) {
      return; // No clip to cut
    }

    // Cut each clip at the playhead
    const newClips: Clip[] = [];
    const clipsToRemove = new Set(clipsAtPlayhead.map(c => c.id));

    clips.forEach(clip => {
      if (clipsToRemove.has(clip.id)) {
        // Split this clip into two
        const cutPoint = frame - clip.startFrame;

        // First half (before cut)
        const firstHalf: Clip = {
          ...clip,
          id: generateId(),
          durationFrames: cutPoint,
          trimEnd: clip.trimEnd + (clip.durationFrames - cutPoint)
        };

        // Second half (after cut)
        const secondHalf: Clip = {
          ...clip,
          id: generateId(),
          startFrame: frame,
          durationFrames: clip.durationFrames - cutPoint,
          trimStart: clip.trimStart + cutPoint
        };

        newClips.push(firstHalf, secondHalf);
      } else {
        newClips.push(clip);
      }
    });

    setClips(newClips);
    setSelection({ type: 'none' });
  }, [clips, currentFrame]);

  // Set In point (start of range)
  const handleSetInPoint = useCallback(() => {
    const frame = Math.round(currentFrame);
    setInPoint(frame);

    if (outPoint !== null && frame < outPoint) {
      // Both points set - create range selection
      setSelection({
        type: 'range',
        startFrame: frame,
        endFrame: outPoint,
        trackIds: tracks.map(t => t.id)
      });
      setEditMessage(`Range: ${frameToTime(frame)} → ${frameToTime(outPoint)}`);
    } else {
      // Clear out point if in point is after it
      if (outPoint !== null && frame >= outPoint) {
        setOutPoint(null);
      }
      setEditMessage(`In point set at ${frameToTime(frame)} — Press O to set out point`);
    }

    // Clear message after 3 seconds
    setTimeout(() => setEditMessage(null), 3000);
  }, [currentFrame, outPoint, tracks]);

  // Set Out point (end of range)
  const handleSetOutPoint = useCallback(() => {
    const frame = Math.round(currentFrame);
    setOutPoint(frame);

    if (inPoint !== null && frame > inPoint) {
      // Both points set - create range selection
      setSelection({
        type: 'range',
        startFrame: inPoint,
        endFrame: frame,
        trackIds: tracks.map(t => t.id)
      });
      setEditMessage(`Range: ${frameToTime(inPoint)} → ${frameToTime(frame)}`);
    } else {
      // Clear in point if out point is before it
      if (inPoint !== null && frame <= inPoint) {
        setInPoint(null);
      }
      setEditMessage(`Out point set at ${frameToTime(frame)} — Press I to set in point`);
    }

    // Clear message after 3 seconds
    setTimeout(() => setEditMessage(null), 3000);
  }, [currentFrame, inPoint, tracks]);

  // Clear In/Out points
  const handleClearInOutPoints = useCallback(() => {
    setInPoint(null);
    setOutPoint(null);
    setSelection({ type: 'none' });
    setEditMessage('In/Out points cleared');
    setTimeout(() => setEditMessage(null), 2000);
  }, []);

  // Delete clips in range (or selected clip)
  const handleDeleteSelection = useCallback(() => {
    if (selection.type === 'clip') {
      // Delete single clip
      setClips(prev => prev.filter(c => c.id !== selection.clipId));
      setSelection({ type: 'none' });
      setShowProperties(false);
    } else if (selection.type === 'range' && selection.startFrame !== undefined && selection.endFrame !== undefined) {
      // Delete parts of clips within range
      const start = selection.startFrame;
      const end = selection.endFrame;

      const newClips: Clip[] = [];

      clips.forEach(clip => {
        const clipStart = clip.startFrame;
        const clipEnd = clip.startFrame + clip.durationFrames;

        // Clip is completely outside range - keep as is
        if (clipEnd <= start || clipStart >= end) {
          newClips.push(clip);
          return;
        }

        // Clip is completely inside range - delete it
        if (clipStart >= start && clipEnd <= end) {
          return;
        }

        // Clip overlaps start of range - keep left part
        if (clipStart < start && clipEnd > start && clipEnd <= end) {
          newClips.push({
            ...clip,
            durationFrames: start - clipStart,
            trimEnd: clip.trimEnd + (clipEnd - start)
          });
          return;
        }

        // Clip overlaps end of range - keep right part
        if (clipStart >= start && clipStart < end && clipEnd > end) {
          newClips.push({
            ...clip,
            id: generateId(),
            startFrame: end,
            durationFrames: clipEnd - end,
            trimStart: clip.trimStart + (end - clipStart)
          });
          return;
        }

        // Clip spans entire range - split into two parts
        if (clipStart < start && clipEnd > end) {
          // Left part
          newClips.push({
            ...clip,
            durationFrames: start - clipStart,
            trimEnd: clip.trimEnd + (clipEnd - start)
          });
          // Right part
          newClips.push({
            ...clip,
            id: generateId(),
            startFrame: end,
            durationFrames: clipEnd - end,
            trimStart: clip.trimStart + (end - clipStart)
          });
        }
      });

      setClips(newClips);
      setSelection({ type: 'none' });
      setInPoint(null);
      setOutPoint(null);
      setEditMessage('Range deleted');
      setTimeout(() => setEditMessage(null), 2000);
    }
  }, [selection, clips]);

  // Move clip to different track
  const handleMoveClipToTrack = useCallback((clipId: string, newTrackId: string) => {
    setClips(prev => prev.map(c =>
      c.id === clipId ? { ...c, trackId: newTrackId } : c
    ));
  }, []);

  const handleUpdateClip = useCallback((clipId: string, updates: Partial<Clip>) => {
    setClips(prev => prev.map(c =>
      c.id === clipId ? { ...c, ...updates } : c
    ));
    setSelectedClipForProps(prev =>
      prev?.id === clipId ? { ...prev, ...updates } : prev
    );
  }, []);

  // Timeline click to set playhead
  const handleTimelineClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.track-content')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 192;
    if (x >= 0) {
      const frame = Math.round(x / (PIXELS_PER_FRAME * zoom));
      setCurrentFrame(Math.max(0, Math.min(frame, totalFrames)));
    }
  }, [zoom, totalFrames]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          setIsPlaying(p => !p);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentFrame(f => Math.max(0, f - (e.shiftKey ? FPS : 1)));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentFrame(f => Math.min(totalFrames, f + (e.shiftKey ? FPS : 1)));
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          handleDeleteSelection();
          break;
        case 'Escape':
          handleClearInOutPoints();
          setShowProperties(false);
          break;
        case 'c':
          handleCutAtPlayhead();
          break;
        case 'i':
          handleSetInPoint();
          break;
        case 'o':
          handleSetOutPoint();
          break;
        case 'x':
          handleClearInOutPoints();
          break;
        case 'm':
          setShowMediaBrowser(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selection, totalFrames, handleCutAtPlayhead, handleSetInPoint, handleSetOutPoint, handleClearInOutPoints, handleDeleteSelection]);

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Film size={18} />
          </div>
          <h1 className="font-semibold">Video Editor</h1>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMediaBrowser(p => !p)}
            className={`p-2 rounded transition-colors ${showMediaBrowser ? 'bg-indigo-600' : 'hover:bg-zinc-800'}`}
            title="Media Browser (M)"
          >
            <FolderOpen size={18} />
          </button>
          <button className="p-2 hover:bg-zinc-800 rounded" title="Export">
            <Download size={18} />
          </button>
          <button className="p-2 hover:bg-zinc-800 rounded" title="Settings">
            <Settings size={18} />
          </button>
          <div className="ml-2 pl-2 border-l border-zinc-700 text-xs text-zinc-500 hidden lg:flex items-center gap-3">
            <span title="Play/Pause"><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">Space</kbd></span>
            <span title="Set In point"><kbd className="px-1.5 py-0.5 bg-green-800 rounded text-green-400">I</kbd></span>
            <span title="Set Out point"><kbd className="px-1.5 py-0.5 bg-yellow-800 rounded text-yellow-400">O</kbd></span>
            <span title="Clear In/Out"><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">X</kbd></span>
            <span title="Cut at playhead"><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">C</kbd></span>
            <span title="Delete"><kbd className="px-1.5 py-0.5 bg-red-800 rounded text-red-400">Del</kbd></span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Media Browser */}
        {showMediaBrowser && (
          <MediaBrowser
            assets={assets}
            onAddAsset={handleAddAsset}
            onDragStart={handleAssetDragStart}
            onAddToTimeline={handleAddToTimeline}
            onClose={() => setShowMediaBrowser(false)}
          />
        )}

        {/* Editor area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video preview */}
          <div style={{ flex: '1 1 0', minHeight: '300px', position: 'relative', overflow: 'hidden' }}>
            <VideoPreview
              clips={clips}
              currentFrame={Math.round(currentFrame)}
              isPlaying={isPlaying}
              onTimeUpdate={setCurrentFrame}
              onPlayToggle={setIsPlaying}
              onLoadedMetadata={handleClipMetadataLoaded}
              selection={selection}
            />
          </div>

          {/* Edit message toast */}
          {editMessage && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg shadow-lg">
              <p className="text-sm text-white">{editMessage}</p>
            </div>
          )}

          {/* Transport controls */}
          <div className="h-14 bg-zinc-900 border-t border-zinc-800 flex items-center justify-center gap-4 px-4 relative">
            <button
              onClick={() => { setCurrentFrame(0); setIsPlaying(false); }}
              className="p-2 hover:bg-zinc-800 rounded"
              title="Go to start"
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={() => setCurrentFrame(f => Math.max(0, f - FPS))}
              className="p-2 hover:bg-zinc-800 rounded"
              title="Previous second"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setIsPlaying(p => !p)}
              className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={() => setCurrentFrame(f => Math.min(totalFrames, f + FPS))}
              className="p-2 hover:bg-zinc-800 rounded"
              title="Next second"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => setCurrentFrame(totalFrames)}
              className="p-2 hover:bg-zinc-800 rounded"
              title="Go to end"
            >
              <SkipForward size={20} />
            </button>

            <div className="w-px h-6 bg-zinc-700 mx-2" />

            <div className="font-mono text-sm bg-zinc-800 px-3 py-1.5 rounded">
              {frameToTime(Math.round(currentFrame))} / {frameToTime(totalFrames)}
            </div>

            <div className="w-px h-6 bg-zinc-700 mx-2" />

            <button
              onClick={() => setZoom(z => Math.max(0.25, z - 0.25))}
              className="p-2 hover:bg-zinc-800 rounded"
              title="Zoom out"
            >
              <ZoomOut size={18} />
            </button>
            <span className="text-sm text-zinc-400 w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(z => Math.min(4, z + 0.25))}
              className="p-2 hover:bg-zinc-800 rounded"
              title="Zoom in"
            >
              <ZoomIn size={18} />
            </button>

            <div className="w-px h-6 bg-zinc-700 mx-2" />

            <button
              onClick={handleCutAtPlayhead}
              className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
              title="Cut at playhead (C)"
            >
              <Scissors size={18} />
            </button>
            <button
              className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-red-400"
              title="Delete selection (Del)"
              onClick={handleDeleteSelection}
              disabled={selection.type === 'none'}
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Timeline */}
          <div
            ref={timelineRef}
            className="h-56 bg-zinc-950 border-t border-zinc-800 overflow-auto relative"
            onClick={handleTimelineClick}
          >
            {/* Time ruler */}
            <div className="sticky top-0 z-20 flex border-b border-zinc-800 bg-zinc-900">
              <div className="w-48 flex-shrink-0 px-3 py-2 text-xs text-zinc-500 border-r border-zinc-800">
                Tracks
              </div>
              <div
                className="relative h-8 bg-zinc-900"
                style={{ width: `${totalFrames * PIXELS_PER_FRAME * zoom}px` }}
              >
                {Array.from({ length: Math.ceil(totalFrames / FPS) + 1 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 h-full flex flex-col items-start"
                    style={{ left: `${i * FPS * PIXELS_PER_FRAME * zoom}px` }}
                  >
                    <div className="w-px h-3 bg-zinc-600" />
                    <span className="text-xs text-zinc-500 ml-1">{i}s</span>
                  </div>
                ))}
              </div>
            </div>

            {/* In/Out Range Highlight */}
            {inPoint !== null && outPoint !== null && (
              <div
                className="absolute top-8 bottom-0 bg-blue-500/20 border-x-2 border-blue-500 z-20 pointer-events-none"
                style={{
                  left: `${192 + Math.min(inPoint, outPoint) * PIXELS_PER_FRAME * zoom}px`,
                  width: `${Math.abs(outPoint - inPoint) * PIXELS_PER_FRAME * zoom}px`
                }}
              />
            )}

            {/* In Point Marker */}
            {inPoint !== null && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-green-500 z-25 pointer-events-none"
                style={{ left: `${192 + inPoint * PIXELS_PER_FRAME * zoom}px` }}
              >
                <div className="absolute -top-0 -left-1.5 w-3 h-4 bg-green-500 text-[8px] text-white flex items-center justify-center font-bold rounded-b">
                  I
                </div>
              </div>
            )}

            {/* Out Point Marker */}
            {outPoint !== null && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-yellow-500 z-25 pointer-events-none"
                style={{ left: `${192 + outPoint * PIXELS_PER_FRAME * zoom}px` }}
              >
                <div className="absolute -top-0 -left-1.5 w-3 h-4 bg-yellow-500 text-[8px] text-black flex items-center justify-center font-bold rounded-b">
                  O
                </div>
              </div>
            )}

            {/* Playhead */}
            <div
              ref={playheadRef}
              className="absolute top-0 bottom-0 w-px bg-red-500 z-30 pointer-events-none"
              style={{ left: `${192 + currentFrame * PIXELS_PER_FRAME * zoom}px` }}
            >
              <div className="absolute -top-0 -left-2 w-4 h-4 bg-red-500" style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
              }} />
            </div>

            {/* Tracks */}
            <div className="relative">
              {tracks.map(track => (
                <TrackComponent
                  key={track.id}
                  track={track}
                  clips={clips.filter(c => c.trackId === track.id)}
                  selection={selection}
                  zoom={zoom}
                  totalFrames={totalFrames}
                  onSelectClip={handleSelectClip}
                  onDragClip={handleDragClip}
                  onTrimClip={handleTrimClip}
                  onRangeSelect={handleRangeSelect}
                  onDropAsset={handleDropAsset}
                  onToggleMute={handleToggleMute}
                />
              ))}
            </div>

            {/* Add track button */}
            <div className="flex border-t border-zinc-800">
              <div className="w-48 flex-shrink-0 px-3 py-2 bg-zinc-900 border-r border-zinc-800">
                <button className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300">
                  <Plus size={16} />
                  Add Track
                </button>
              </div>
            </div>
          </div>

          {/* Claude Context Panel */}
          <ClaudeContextPanel
            context={{
              selection,
              currentFrame: Math.round(currentFrame),
              clips,
              activeClip: activeClip || undefined
            }}
            onSendToClaude={handleSendToClaude}
            onScreenshot={handleScreenshot}
          />
        </div>

        {/* Properties panel */}
        {showProperties && (
          <PropertiesPanel
            clip={selectedClipForProps}
            onUpdate={handleUpdateClip}
            onClose={() => setShowProperties(false)}
          />
        )}
      </div>
    </div>
  );
}
