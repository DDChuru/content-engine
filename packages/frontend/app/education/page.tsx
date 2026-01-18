'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Play, Clock, CheckCircle, ArrowRight, Plus } from 'lucide-react';

const STATS = {
  totalLessons: 12,
  completed: 10,
  totalDuration: '45m 30s',
  totalCost: '$15.23'
};

const RECENT_LESSONS = [
  {
    id: 'sets-lesson',
    title: 'Introduction to Sets',
    subtitle: 'Understanding Collections and Relationships',
    duration: '3m 15s',
    scenes: 13,
    status: 'completed',
  },
  {
    id: 'trig-basics',
    title: 'Trigonometry Basics',
    subtitle: 'Sine, Cosine, and Tangent',
    duration: '4m 30s',
    scenes: 15,
    status: 'draft',
  }
];

export default function EducationDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Educator</span>
        </h1>
        <p className="text-zinc-400">Ready to create world-class educational content?</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <BookOpen size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Total Lessons</p>
              <p className="text-2xl font-bold">{STATS.totalLessons}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <CheckCircle size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Completed</p>
              <p className="text-2xl font-bold">{STATS.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Clock size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Total Duration</p>
              <p className="text-2xl font-bold">{STATS.totalDuration}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Play size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Cost</p>
              <p className="text-2xl font-bold">{STATS.totalCost}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        <Link
          href="/education/learn"
          className="group bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl p-6 hover:border-indigo-400/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Browse Syllabus</h3>
              <p className="text-zinc-400">Explore Cambridge IGCSE topics and lessons</p>
            </div>
            <ArrowRight size={24} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/education/lessons"
          className="group bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-400/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Create New Lesson</h3>
              <p className="text-zinc-400">Build a new educational video with AI</p>
            </div>
            <Plus size={24} className="text-emerald-400 group-hover:rotate-90 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Recent Lessons */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Lessons</h2>
          <Link href="/education/lessons" className="text-indigo-400 hover:text-indigo-300 text-sm">
            View all →
          </Link>
        </div>

        <div className="space-y-3">
          {RECENT_LESSONS.map(lesson => (
            <div
              key={lesson.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Play size={20} className="text-zinc-500" />
                </div>
                <div>
                  <h3 className="font-semibold">{lesson.title}</h3>
                  <p className="text-sm text-zinc-500">{lesson.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-zinc-400">
                <span>{lesson.scenes} scenes</span>
                <span>{lesson.duration}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  lesson.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {lesson.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
