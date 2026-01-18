'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ChevronDown,
  BookOpen,
  Clock,
  CheckCircle,
  Circle,
  Sparkles,
  GraduationCap,
  Loader2,
  Play,
  Wand2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface TopicWithStatus {
  code: string;
  title: string;
  level: 'Core' | 'Extended';
  hasLesson: boolean;
  lessonMeta?: {
    estimatedDuration: number;
    sectionsCount: number;
    examplesCount: number;
    generatedAt: string;
  };
}

interface Unit {
  code: string;
  title: string;
  level: 'Core' | 'Extended';
  topics: TopicWithStatus[];
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

export default function LearnPage() {
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [topicsStatus, setTopicsStatus] = useState<Record<string, TopicWithStatus>>({});
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'Core' | 'Extended'>('all');
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [generatingTopics, setGeneratingTopics] = useState<Set<string>>(new Set());
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch syllabus and topics status in parallel
      const [syllabusRes, topicsRes] = await Promise.all([
        fetch(`${API_URL}/api/education/syllabus`),
        fetch(`${API_URL}/api/education/syllabus/topics`)
      ]);

      const syllabusData = await syllabusRes.json();
      const topicsData = await topicsRes.json();

      if (syllabusData.success) {
        setSyllabus(syllabusData.syllabus);
        // Expand first unit by default
        if (syllabusData.syllabus?.units?.length > 0) {
          setExpandedUnits(new Set([syllabusData.syllabus.units[0].code]));
        }
      }

      if (topicsData.success) {
        // Build lookup by topic code
        const statusMap: Record<string, TopicWithStatus> = {};
        for (const topic of topicsData.topics) {
          statusMap[topic.code.toLowerCase()] = topic;
        }
        setTopicsStatus(statusMap);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateLesson = async (topicCode: string) => {
    setGeneratingTopics(prev => new Set([...prev, topicCode]));
    setGenerationError(null);

    try {
      const res = await fetch(`${API_URL}/api/education/generate/${topicCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferredStyle: 'auto',
          exampleCount: 6,
          practiceCount: 10
        })
      });

      const data = await res.json();

      if (data.success) {
        // Refresh topics status
        const topicsRes = await fetch(`${API_URL}/api/education/syllabus/topics`);
        const topicsData = await topicsRes.json();
        if (topicsData.success) {
          const statusMap: Record<string, TopicWithStatus> = {};
          for (const topic of topicsData.topics) {
            statusMap[topic.code.toLowerCase()] = topic;
          }
          setTopicsStatus(statusMap);
        }
      } else {
        setGenerationError(data.error || 'Failed to generate lesson');
      }
    } catch (err: any) {
      console.error('Failed to generate lesson:', err);
      setGenerationError(err.message || 'Failed to generate lesson');
    } finally {
      setGeneratingTopics(prev => {
        const next = new Set(prev);
        next.delete(topicCode);
        return next;
      });
    }
  };

  const toggleUnit = (code: string) => {
    setExpandedUnits(prev => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const getTopicStatus = (topicCode: string): TopicWithStatus | null => {
    return topicsStatus[topicCode.toLowerCase()] || null;
  };

  const filteredUnits = syllabus?.units?.filter(unit =>
    selectedLevel === 'all' || unit.level === selectedLevel
  ) || [];

  // Calculate summary stats
  const allTopics = Object.values(topicsStatus);
  const generatedCount = allTopics.filter(t => t.hasLesson).length;
  const totalCount = allTopics.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-4 text-indigo-500" />
          <p className="text-zinc-500">Loading syllabus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <GraduationCap size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{syllabus?.metadata?.title || 'Cambridge IGCSE Mathematics'}</h1>
              <p className="text-zinc-500">{syllabus?.metadata?.code || '0580'} • {syllabus?.metadata?.examBoard}</p>
            </div>
          </div>

          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-sm"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{generatedCount}</p>
                <p className="text-xs text-zinc-500">Lessons Ready</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Sparkles size={20} className="text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCount - generatedCount}</p>
                <p className="text-xs text-zinc-500">To Generate</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <BookOpen size={20} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCount}</p>
                <p className="text-xs text-zinc-500">Total Topics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Level Filter */}
        <div className="flex gap-2">
          {(['all', 'Core', 'Extended'] as const).map(level => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedLevel === level
                  ? 'bg-indigo-500 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {level === 'all' ? 'All Levels' : level}
            </button>
          ))}
        </div>
      </header>

      {/* Error Message */}
      {generationError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} className="text-red-400" />
          <p className="text-red-400">{generationError}</p>
          <button
            onClick={() => setGenerationError(null)}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Units */}
      <div className="space-y-4">
        {filteredUnits.map(unit => {
          const unitTopics = unit.topics.map(t => getTopicStatus(t.code) || {
            code: t.code,
            title: t.title,
            level: t.level,
            hasLesson: false
          });
          const unitGenerated = unitTopics.filter(t => t.hasLesson).length;

          return (
            <div key={unit.code} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              {/* Unit Header */}
              <button
                onClick={() => toggleUnit(unit.code)}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {expandedUnits.has(unit.code) ? (
                    <ChevronDown size={20} className="text-zinc-500" />
                  ) : (
                    <ChevronRight size={20} className="text-zinc-500" />
                  )}
                  <div className="text-left">
                    <h3 className="font-semibold">{unit.title}</h3>
                    <p className="text-sm text-zinc-500">
                      {unitGenerated}/{unit.topics.length} generated • {unit.level}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Progress bar */}
                  <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: `${(unitGenerated / unit.topics.length) * 100}%` }}
                    />
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    unit.level === 'Core' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {unit.level}
                  </span>
                </div>
              </button>

              {/* Topics */}
              {expandedUnits.has(unit.code) && (
                <div className="border-t border-zinc-800">
                  {unit.topics.map((topic) => {
                    const status = getTopicStatus(topic.code);
                    const hasLesson = status?.hasLesson || false;
                    const isGenerating = generatingTopics.has(topic.code);

                    return (
                      <div
                        key={topic.code}
                        className="flex items-center justify-between p-4 border-b border-zinc-800 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          {hasLesson ? (
                            <CheckCircle size={18} className="text-emerald-500" />
                          ) : isGenerating ? (
                            <Loader2 size={18} className="text-amber-500 animate-spin" />
                          ) : (
                            <Circle size={18} className="text-zinc-600" />
                          )}
                          <div>
                            <p className="font-medium">{topic.title}</p>
                            <div className="flex items-center gap-3 text-xs text-zinc-500">
                              <span>{topic.code}</span>
                              {status?.lessonMeta && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock size={12} />
                                    {status.lessonMeta.estimatedDuration}m
                                  </span>
                                  <span>•</span>
                                  <span>{status.lessonMeta.sectionsCount} sections</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {hasLesson ? (
                            <Link
                              href={`/education/learn/${topic.code}`}
                              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-medium transition-colors"
                            >
                              <Play size={16} />
                              View Lesson
                            </Link>
                          ) : isGenerating ? (
                            <span className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg text-sm">
                              <Loader2 size={16} className="animate-spin" />
                              Generating...
                            </span>
                          ) : (
                            <button
                              onClick={() => generateLesson(topic.code)}
                              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
                            >
                              <Wand2 size={16} />
                              Generate with Claude
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filteredUnits.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
            <p>No units found for the selected level</p>
          </div>
        )}
      </div>
    </div>
  );
}
