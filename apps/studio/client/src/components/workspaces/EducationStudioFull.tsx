/**
 * Education Studio - Cambridge IGCSE Learning Platform
 * Full syllabus-based interface with lesson viewing and creation
 *
 * Features:
 * - Syllabus viewer with units & topics
 * - Progress tracking per topic
 * - Level filtering (Core/Extended)
 * - Lesson builder for creating new content
 * - Video preview with Studio Bridge
 */

import { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Clock,
  FileVideo,
  Send,
  RefreshCw,
  Wifi,
  WifiOff,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Target,
  TrendingUp,
  CheckCircle,
  Circle,
  Lock,
  Wand2,
  Play
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ============================================
// TYPES
// ============================================

interface Topic {
  code: string;
  title: string;
  level: 'Core' | 'Extended';
  status: 'not_started' | 'in_progress' | 'completed';
  estimatedDuration: number;
  hasLesson: boolean;
}

interface Unit {
  code: string;
  title: string;
  level: 'Core' | 'Extended';
  topics: Topic[];
}

interface Syllabus {
  metadata: {
    title: string;
    code: string;
    examBoard: string;
    years: number[];
  };
  units: Unit[];
}

interface Lesson {
  id: string;
  title: string;
  type: 'manim' | 'video' | 'html' | 'streamlined';
  path: string;
  filename: string;
  duration?: number;
  scenes?: number;
  size: number;
  createdAt: string;
  metadata?: {
    scenes?: Array<{
      scene_id: string;
      title: string;
      duration: number;
      type: string;
    }>;
  };
}

interface ChangeRequest {
  id: string;
  changeType: string;
  step: string;
  instruction: string;
  timestamp: string;
  status: 'pending' | 'completed';
}

interface EducationStudioProps {
  onContextUpdate?: (context: {
    workspace: 'education-studio';
    selection?: unknown;
    activeItem?: { id: string; name: string; type: string };
    metadata?: Record<string, unknown>;
  }) => void;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

const formatDuration = (seconds?: number) => {
  if (!seconds) return 'N/A';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs}s`;
};

const formatSize = (bytes: number) => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

// ============================================
// MAIN COMPONENT
// ============================================

type ViewMode = 'syllabus' | 'lessons' | 'builder' | 'studio';

export default function EducationStudioFull({ onContextUpdate }: EducationStudioProps) {
  // View state
  const [view, setView] = useState<ViewMode>('syllabus');

  // Syllabus state
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'Core' | 'Extended'>('all');
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  // Lessons state
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Builder state
  const [builderTopic, setBuilderTopic] = useState('');
  const [builderDifficulty, setBuilderDifficulty] = useState('intermediate');
  const [includeExamples, setIncludeExamples] = useState(true);
  const [includePractice, setIncludePractice] = useState(true);

  // Studio state
  const videoRef = useRef<HTMLVideoElement>(null);

  // Bridge state
  const [connected, setConnected] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<ChangeRequest[]>([]);
  const [changeType, setChangeType] = useState('visual');
  const [stepId, setStepId] = useState('');
  const [instruction, setInstruction] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchSyllabus();
    fetchLessons();
    checkConnection();
  }, []);

  // Send context updates
  useEffect(() => {
    if (!onContextUpdate) return;

    onContextUpdate({
      workspace: 'education-studio',
      activeItem: selectedTopic ? {
        id: selectedTopic.code,
        name: selectedTopic.title,
        type: 'topic'
      } : selectedLesson ? {
        id: selectedLesson.id,
        name: selectedLesson.title,
        type: selectedLesson.type
      } : undefined,
      metadata: {
        view,
        selectedLevel,
        totalTopics: syllabus?.units?.reduce((acc, u) => acc + u.topics.length, 0) || 0,
        totalLessons: lessons.length,
        pendingRequests: pendingRequests.length
      }
    });
  }, [view, selectedTopic, selectedLesson, selectedLevel, syllabus, lessons, pendingRequests, onContextUpdate]);

  const fetchSyllabus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/education/syllabus`);
      const data = await res.json();
      if (data.success) {
        setSyllabus(data.syllabus);
        if (data.syllabus?.units?.length > 0) {
          setExpandedUnits(new Set([data.syllabus.units[0].code]));
        }
      }
    } catch (error) {
      console.error('Failed to fetch syllabus:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async () => {
    try {
      const res = await fetch(`${API_URL}/api/lessons`);
      const data = await res.json();
      if (data.success) {
        setLessons(data.lessons);
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    }
  };

  const checkConnection = async () => {
    try {
      const res = await fetch(`${API_URL}/api/health`);
      setConnected(res.ok);
    } catch {
      setConnected(false);
    }
  };

  const toggleUnit = (unitCode: string) => {
    setExpandedUnits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(unitCode)) {
        newSet.delete(unitCode);
      } else {
        newSet.add(unitCode);
      }
      return newSet;
    });
  };

  const openTopicLesson = (topic: Topic) => {
    setSelectedTopic(topic);
    // Find lesson for this topic
    const lesson = lessons.find(l => l.title.toLowerCase().includes(topic.title.toLowerCase()));
    if (lesson) {
      setSelectedLesson(lesson);
      setView('studio');
    } else {
      // Open builder with topic pre-filled
      setBuilderTopic(topic.title);
      setView('builder');
    }
  };

  const openStudio = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setView('studio');
  };

  const sendChangeRequest = async () => {
    if (!stepId || !instruction) {
      alert('Please fill in step ID and instruction');
      return;
    }
    setIsSubmitting(true);
    try {
      const changeData = {
        changeType,
        step: stepId,
        instruction,
        lessonId: selectedLesson?.id,
        lessonTitle: selectedLesson?.title,
        timestamp: new Date().toISOString()
      };
      const res = await fetch(`${API_URL}/api/studio/change-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changeData)
      });
      const data = await res.json();
      if (data.success) {
        setPendingRequests(prev => [...prev, { ...changeData, id: data.requestId, status: 'pending' }]);
        setInstruction('');
        alert(`Change request sent! Tell Claude: "process studio requests"`);
      }
    } catch (error) {
      console.error('Failed to send request:', error);
      alert('Failed to send request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Computed values
  const filteredUnits = syllabus?.units?.filter(unit =>
    selectedLevel === 'all' || unit.level === selectedLevel
  ) || [];

  const stats = {
    totalTopics: filteredUnits.reduce((acc, u) => acc + u.topics.length, 0),
    completed: filteredUnits.reduce((acc, u) => acc + u.topics.filter(t => t.status === 'completed').length, 0),
    available: filteredUnits.reduce((acc, u) => acc + u.topics.filter(t => t.hasLesson).length, 0),
  };

  const getStatusIcon = (status: string, hasLesson: boolean) => {
    if (!hasLesson) return <Lock className="w-4 h-4 text-slate-400" />;
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'in_progress': return <Circle className="w-4 h-4 text-amber-500 fill-amber-500/30" />;
      default: return <Circle className="w-4 h-4 text-slate-400" />;
    }
  };

  // ============================================
  // RENDER: SYLLABUS VIEW
  // ============================================
  if (view === 'syllabus') {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-indigo-950 via-purple-950 to-zinc-950 overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <GraduationCap size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {syllabus?.metadata?.title || 'Cambridge IGCSE Mathematics'}
                </h1>
                <p className="text-sm text-zinc-400">
                  {syllabus?.metadata?.examBoard} • {syllabus?.metadata?.years?.join(', ')}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView('lessons')}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-zinc-300 flex items-center gap-2"
              >
                <FileVideo size={16} />
                Lessons
              </button>
              <button
                onClick={() => setView('builder')}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg text-sm text-white font-medium flex items-center gap-2"
              >
                <Wand2 size={16} />
                Create Lesson
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Target size={20} className="text-blue-400" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Total Topics</div>
                  <div className="text-2xl font-bold text-white">{stats.totalTopics}</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <BookOpen size={20} className="text-green-400" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Available Lessons</div>
                  <div className="text-2xl font-bold text-white">{stats.available}</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <TrendingUp size={20} className="text-amber-400" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Your Progress</div>
                  <div className="text-2xl font-bold text-white">
                    {stats.totalTopics > 0 ? Math.round((stats.completed / stats.totalTopics) * 100) : 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Level Filter */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-400 font-medium">Filter by level:</span>
              {(['all', 'Core', 'Extended'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedLevel === level
                      ? 'bg-indigo-500 text-white'
                      : 'bg-transparent text-zinc-400 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {level === 'all' ? 'All Topics' : level}
                </button>
              ))}
            </div>
          </div>

          {/* Units List */}
          {loading ? (
            <div className="text-center py-12 text-zinc-400">
              <Sparkles size={32} className="mx-auto mb-3 opacity-50" />
              <div>Loading syllabus...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUnits.map(unit => (
                <div key={unit.code} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  {/* Unit Header */}
                  <button
                    onClick={() => toggleUnit(unit.code)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold text-white ${
                        unit.level === 'Core'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                          : 'bg-gradient-to-br from-purple-500 to-purple-600'
                      }`}>
                        {unit.code.replace('C', '').replace('E', '')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white">{unit.title}</h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded border ${
                            unit.level === 'Core'
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                          }`}>
                            {unit.level}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-400">
                          {unit.topics.length} topics • {unit.topics.filter(t => t.hasLesson).length} lessons available
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={24}
                      className={`text-zinc-400 transition-transform ${
                        expandedUnits.has(unit.code) ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  {/* Topics List */}
                  {expandedUnits.has(unit.code) && (
                    <div className="border-t border-white/10 p-4">
                      <div className="space-y-2">
                        {unit.topics.map(topic => (
                          <button
                            key={topic.code}
                            onClick={() => topic.hasLesson && openTopicLesson(topic)}
                            disabled={!topic.hasLesson}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                              topic.hasLesson
                                ? 'bg-white/5 border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 cursor-pointer'
                                : 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {getStatusIcon(topic.status, topic.hasLesson)}
                              <div>
                                <div className="text-xs text-zinc-400 mb-0.5">{topic.code}</div>
                                <div className="font-medium text-white">{topic.title}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-xs text-zinc-500">
                                <Clock size={12} />
                                {topic.estimatedDuration} min
                              </div>
                              {topic.hasLesson ? (
                                <ChevronRight size={20} className="text-indigo-400" />
                              ) : (
                                <span className="text-xs text-zinc-500 italic">Coming soon</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: LESSONS VIEW
  // ============================================
  if (view === 'lessons') {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-indigo-950 via-purple-950 to-zinc-950 overflow-hidden">
        <header className="flex-shrink-0 px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('syllabus')} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Rendered Lessons</h1>
              <p className="text-sm text-zinc-400">{lessons.length} lessons available</p>
            </div>
          </div>
          <button onClick={fetchLessons} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-zinc-300">
            <RefreshCw size={14} />
            Refresh
          </button>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {lessons.length === 0 ? (
            <div className="text-center py-12">
              <FileVideo size={48} className="mx-auto mb-4 text-zinc-600" />
              <p className="text-zinc-400">No lessons found</p>
              <button onClick={() => setView('builder')} className="mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm text-white">
                Create First Lesson
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {lessons.map(lesson => (
                <div
                  key={lesson.id}
                  onClick={() => openStudio(lesson)}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-indigo-500/20 text-indigo-400">
                      {lesson.type}
                    </span>
                    {lesson.scenes && <span className="text-xs text-zinc-400">{lesson.scenes} scenes</span>}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{lesson.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-zinc-400">
                    {lesson.duration && <span className="flex items-center gap-1"><Clock size={12} />{formatDuration(lesson.duration)}</span>}
                    <span className="flex items-center gap-1"><FileVideo size={12} />{formatSize(lesson.size)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">{new Date(lesson.createdAt).toLocaleDateString()}</span>
                    <Play size={16} className="text-indigo-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: BUILDER VIEW
  // ============================================
  if (view === 'builder') {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-indigo-950 via-purple-950 to-zinc-950 overflow-hidden">
        <header className="flex-shrink-0 px-6 py-4 border-b border-white/10 flex items-center gap-3">
          <button onClick={() => setView('syllabus')} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Lesson Builder</h1>
            <p className="text-sm text-zinc-400">Create new Cambridge IGCSE lessons with AI</p>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Topic / Concept</label>
                  <input
                    type="text"
                    value={builderTopic}
                    onChange={(e) => setBuilderTopic(e.target.value)}
                    placeholder="e.g., Pythagoras' Theorem, Quadratic Equations..."
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Difficulty Level</label>
                  <select
                    value={builderDifficulty}
                    onChange={(e) => setBuilderDifficulty(e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="foundation">Foundation (Core)</option>
                    <option value="intermediate">Intermediate (Extended)</option>
                    <option value="advanced">Advanced (Additional)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-3">Lesson Components</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5 cursor-pointer">
                      <input type="checkbox" checked={includeExamples} onChange={(e) => setIncludeExamples(e.target.checked)} className="w-4 h-4" />
                      <div>
                        <div className="font-medium text-white">Worked Examples</div>
                        <div className="text-xs text-zinc-400">Step-by-step solutions with handwritten work</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5 cursor-pointer">
                      <input type="checkbox" checked={includePractice} onChange={(e) => setIncludePractice(e.target.checked)} className="w-4 h-4" />
                      <div>
                        <div className="font-medium text-white">Practice Questions</div>
                        <div className="text-xs text-zinc-400">Interactive exercises with instant feedback</div>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!builderTopic) { alert('Please enter a topic'); return; }
                    alert(`Lesson generation coming soon!\n\nTopic: ${builderTopic}\nDifficulty: ${builderDifficulty}`);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg text-lg font-bold text-white flex items-center justify-center gap-3"
                >
                  <Wand2 size={20} />
                  Generate Lesson with AI
                </button>
              </div>
            </div>

            {/* Info Panel */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-indigo-400" />
                  <h4 className="font-medium text-white">What Happens Next</h4>
                </div>
                <ol className="text-sm text-zinc-400 space-y-2">
                  <li>1. Claude generates lesson structure</li>
                  <li>2. Creates Manim animation scripts</li>
                  <li>3. Builds Remotion composition</li>
                  <li>4. Generates narration</li>
                </ol>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h4 className="font-medium text-white mb-3">Cost Estimate</h4>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-zinc-400">Manim Animations</div>
                    <div className="text-lg font-bold text-green-400">$0.00 (Local)</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400">With Narration</div>
                    <div className="text-lg font-bold text-white">~$0.90</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: STUDIO VIEW
  // ============================================
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-indigo-950 via-purple-950 to-zinc-950 overflow-hidden">
      <header className="flex-shrink-0 px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('lessons')} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-semibold text-white">{selectedLesson?.title || 'Studio'}</h1>
            <p className="text-xs text-zinc-400">Studio Editor</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${connected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </header>

      <div className="flex-1 grid grid-cols-[1fr_350px] gap-4 p-4 overflow-hidden">
        {/* Video Preview */}
        <div className="flex flex-col overflow-hidden">
          <div className="bg-black rounded-xl overflow-hidden">
            {selectedLesson && (
              <video
                ref={videoRef}
                src={`${API_URL}/api/lessons/${selectedLesson.id}/video`}
                crossOrigin="anonymous"
                controls
                className="w-full"
              />
            )}
          </div>
          <div className="mt-3 text-sm text-zinc-400">
            {selectedLesson?.scenes && `${selectedLesson.scenes} scenes`}
            {selectedLesson?.duration && ` • ${formatDuration(selectedLesson.duration)}`}
          </div>
        </div>

        {/* Studio Bridge Panel */}
        <div className="flex flex-col bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-semibold text-white mb-3">Studio Bridge</h3>
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3 text-xs text-zinc-300 mb-4">
              <p>1. Select a scene or enter step ID</p>
              <p>2. Describe your change</p>
              <p>3. Tell Claude: <code className="bg-black/30 px-1 py-0.5 rounded">process studio requests</code></p>
            </div>
            <div className="space-y-3">
              <select value={changeType} onChange={(e) => setChangeType(e.target.value)} className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white">
                <option value="visual">Visual Adjustment</option>
                <option value="narration">Change Narration</option>
                <option value="animation">Animation Timing</option>
                <option value="color">Change Color</option>
                <option value="text">Update Text</option>
              </select>
              <input type="text" value={stepId} onChange={(e) => setStepId(e.target.value)} placeholder="Step/Scene ID" className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white placeholder-zinc-500" />
              <textarea value={instruction} onChange={(e) => setInstruction(e.target.value)} placeholder="Describe the change..." rows={3} className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white placeholder-zinc-500 resize-none" />
              <div className="flex gap-2">
                <button onClick={sendChangeRequest} disabled={isSubmitting || !connected} className="flex-1 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 rounded-lg text-sm font-medium text-white">
                  <Send size={14} />
                  {isSubmitting ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <div className="text-xs text-zinc-400 mb-2">Pending ({pendingRequests.length})</div>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 text-sm">No pending requests</div>
            ) : (
              <div className="space-y-2">
                {pendingRequests.slice(0, 5).map(req => (
                  <div key={req.id} className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="text-xs font-medium text-amber-400">{req.changeType} • {req.step}</div>
                    <div className="text-xs text-zinc-400 mt-1 truncate">{req.instruction}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
