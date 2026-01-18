'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wand2,
  Film,
  Play,
  Clock,
  FileVideo,
  Loader2,
  ExternalLink,
  Calendar,
  HardDrive,
  Layers,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface LessonScene {
  scene_id: string;
  title: string;
  duration: number;
  type: string;
}

interface LessonMetadata {
  title: string;
  subtitle?: string;
  total_scenes: number;
  total_duration: number;
  scenes: LessonScene[];
  parts?: Record<string, { duration: number; scenes: number }>;
}

interface Lesson {
  id: string;
  title: string;
  type: string;
  path: string;
  filename: string;
  duration?: number;
  scenes?: number;
  size: number;
  createdAt: string;
  metadata?: LessonMetadata;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'manim': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'streamlined': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'video': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'html': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
  }
}

function LessonCard({ lesson, onSelect }: { lesson: Lesson; onSelect: (lesson: Lesson) => void }) {
  const [imageError, setImageError] = useState(false);

  // Generate a thumbnail URL if the lesson has a video
  const videoUrl = lesson.path.includes('.mp4')
    ? `${API_URL}/api/lessons/${lesson.id}/video`
    : null;

  return (
    <div
      className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all group cursor-pointer"
      onClick={() => onSelect(lesson)}
    >
      {/* Thumbnail / Preview */}
      <div className="aspect-video bg-zinc-950 relative flex items-center justify-center">
        {videoUrl && !imageError ? (
          <video
            src={videoUrl}
            className="w-full h-full object-cover"
            muted
            preload="metadata"
            onError={() => setImageError(true)}
            onMouseEnter={(e) => {
              e.currentTarget.currentTime = 1;
              e.currentTarget.play().catch(() => {});
            }}
            onMouseLeave={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-600">
            <Film size={48} className="mb-2 opacity-50" />
            <span className="text-sm">{lesson.type}</span>
          </div>
        )}

        {/* Duration badge */}
        {lesson.duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-mono text-white">
            {formatDuration(lesson.duration)}
          </div>
        )}

        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-indigo-500/90 flex items-center justify-center">
            <Play size={24} className="text-white ml-1" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <span className={`px-2 py-0.5 rounded border text-xs font-medium ${getTypeColor(lesson.type)}`}>
            {lesson.type}
          </span>
          {lesson.scenes && (
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-xs">
              {lesson.scenes} scenes
            </span>
          )}
        </div>

        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
          {lesson.title}
        </h3>

        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <HardDrive size={12} />
            {formatSize(lesson.size)}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(lesson.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

function LessonDetailPanel({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
  const videoUrl = `${API_URL}/api/lessons/${lesson.id}/video`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <span className={`px-2 py-0.5 rounded border text-xs font-medium ${getTypeColor(lesson.type)} mb-2 inline-block`}>
              {lesson.type}
            </span>
            <h2 className="text-xl font-bold text-white">{lesson.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Video Preview */}
        <div className="aspect-video bg-black relative">
          {lesson.path.includes('.mp4') ? (
            <video
              src={videoUrl}
              className="w-full h-full"
              controls
              autoPlay={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600">
              <Film size={64} />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {lesson.duration && (
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <div className="text-xs text-zinc-500 mb-1">Duration</div>
                <div className="font-mono text-white">{formatDuration(lesson.duration)}</div>
              </div>
            )}
            {lesson.scenes && (
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <div className="text-xs text-zinc-500 mb-1">Scenes</div>
                <div className="font-mono text-white">{lesson.scenes}</div>
              </div>
            )}
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <div className="text-xs text-zinc-500 mb-1">Size</div>
              <div className="font-mono text-white">{formatSize(lesson.size)}</div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <div className="text-xs text-zinc-500 mb-1">Created</div>
              <div className="text-white text-sm">{formatDate(lesson.createdAt)}</div>
            </div>
          </div>

          {/* Scenes breakdown */}
          {lesson.metadata?.scenes && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Layers size={16} className="text-indigo-400" />
                Scene Breakdown
              </h3>
              <div className="space-y-2">
                {lesson.metadata.scenes.map((scene, idx) => (
                  <div key={scene.scene_id} className="flex items-center gap-3 bg-zinc-800/30 rounded-lg p-2">
                    <span className="w-6 h-6 rounded bg-zinc-700 flex items-center justify-center text-xs text-zinc-400">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-sm text-zinc-300">{scene.title}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      scene.type === 'intro' ? 'bg-blue-500/20 text-blue-400' :
                      scene.type === 'manim' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-zinc-700 text-zinc-400'
                    }`}>
                      {scene.type}
                    </span>
                    <span className="font-mono text-xs text-zinc-500 w-12 text-right">
                      {scene.duration}s
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-zinc-800 flex gap-3">
          <Link
            href={`/studio/editor?lesson=${lesson.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors"
          >
            <Wand2 size={18} />
            Open in Editor
          </Link>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <ExternalLink size={18} />
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

export default function StudioPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await fetch(`${API_URL}/api/lessons`);
      const data = await res.json();
      if (data.success && data.lessons) {
        setLessons(data.lessons);
      } else {
        setError('Failed to load lessons');
      }
    } catch (err) {
      console.error('Failed to fetch lessons:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Get unique types for filter
  const lessonTypes = [...new Set(lessons.map(l => l.type))];

  // Filter lessons
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !typeFilter || lesson.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Group lessons by type for stats
  const stats = lessons.reduce((acc, lesson) => {
    acc[lesson.type] = (acc[lesson.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-4 text-indigo-500" />
          <p className="text-zinc-500">Loading video lessons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchLessons}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Studio Editor</h1>
        <p className="text-zinc-400">Select a video lesson to preview or edit</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <FileVideo size={20} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{lessons.length}</p>
              <p className="text-xs text-zinc-500">Total Lessons</p>
            </div>
          </div>
        </div>
        {Object.entries(stats).slice(0, 3).map(([type, count]) => (
          <div key={type} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(type).replace('text-', 'bg-').replace('-400', '-500/20')}`}>
                <Film size={20} className={getTypeColor(type).split(' ')[1]} />
              </div>
              <div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-zinc-500 capitalize">{type}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-zinc-500" />
          <select
            value={typeFilter || ''}
            onChange={(e) => setTypeFilter(e.target.value || null)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Types</option>
            {lessonTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lessons Grid */}
      {filteredLessons.length === 0 ? (
        <div className="flex items-center justify-center h-64 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="text-center">
            <Film size={48} className="mx-auto mb-4 text-zinc-600" />
            <p className="text-zinc-500">No lessons found</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-indigo-400 hover:text-indigo-300"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map(lesson => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onSelect={setSelectedLesson}
            />
          ))}
        </div>
      )}

      {/* Detail Panel */}
      {selectedLesson && (
        <LessonDetailPanel
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
        />
      )}
    </div>
  );
}
