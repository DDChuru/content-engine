'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, BookOpen, Clock, CheckCircle, Circle, Lock, GraduationCap } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

export default function LearnPage() {
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'Core' | 'Extended'>('all');
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchSyllabus();
  }, []);

  const fetchSyllabus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/education/syllabus`);
      const data = await res.json();
      if (data.success) {
        setSyllabus(data.syllabus);
        // Expand first unit by default
        if (data.syllabus?.units?.length > 0) {
          setExpandedUnits(new Set([data.syllabus.units[0].code]));
        }
      }
    } catch (err) {
      console.error('Failed to fetch syllabus:', err);
    } finally {
      setLoading(false);
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

  const getStatusIcon = (status: string, hasLesson: boolean) => {
    if (!hasLesson) return <Lock size={16} className="text-zinc-600" />;
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-emerald-500" />;
      case 'in_progress':
        return <Circle size={16} className="text-amber-500" />;
      default:
        return <Circle size={16} className="text-zinc-600" />;
    }
  };

  const filteredUnits = syllabus?.units?.filter(unit =>
    selectedLevel === 'all' || unit.level === selectedLevel
  ) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <GraduationCap size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{syllabus?.metadata?.title || 'Cambridge IGCSE Mathematics'}</h1>
            <p className="text-zinc-500">{syllabus?.metadata?.code || '0580'} • {syllabus?.metadata?.examBoard}</p>
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

      {/* Units */}
      <div className="space-y-4">
        {filteredUnits.map(unit => (
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
                  <p className="text-sm text-zinc-500">{unit.topics.length} topics • {unit.level}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                unit.level === 'Core' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
              }`}>
                {unit.level}
              </span>
            </button>

            {/* Topics */}
            {expandedUnits.has(unit.code) && (
              <div className="border-t border-zinc-800">
                {unit.topics.map((topic, i) => (
                  <Link
                    key={topic.code}
                    href={topic.hasLesson ? `/education/learn/${topic.code}` : '#'}
                    className={`flex items-center justify-between p-4 border-b border-zinc-800 last:border-0 transition-colors ${
                      topic.hasLesson ? 'hover:bg-zinc-800/50' : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(topic.status, topic.hasLesson)}
                      <div>
                        <p className="font-medium">{topic.title}</p>
                        <p className="text-xs text-zinc-500">{topic.code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {topic.estimatedDuration}m
                      </span>
                      {topic.hasLesson && <ChevronRight size={16} />}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

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
