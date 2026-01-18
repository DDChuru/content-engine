'use client';

import { BookOpen, Clock, ChevronRight, Star, Trophy, Target } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Sample topic data - this would come from API in production
const topics = [
  {
    code: 'C1.1',
    title: 'Types of Number',
    description: 'Natural numbers, integers, primes, and more',
    duration: 45,
    difficulty: 'core',
    progress: 0,
    available: false,
  },
  {
    code: 'C1.2',
    title: 'Introduction to Sets',
    description: 'Set notation, Venn diagrams, union, intersection, and complement',
    duration: 45,
    difficulty: 'core',
    progress: 0,
    available: true,
  },
  {
    code: 'C1.3',
    title: 'Fractions, Decimals and Percentages',
    description: 'Converting between fractions, decimals and percentages',
    duration: 50,
    difficulty: 'core',
    progress: 0,
    available: false,
  },
  {
    code: 'C1.4',
    title: 'Powers and Roots',
    description: 'Square roots, cube roots, indices, and standard form',
    duration: 55,
    difficulty: 'core',
    progress: 0,
    available: false,
  },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-3">
          Welcome to <span className="gradient-text">IGCSE Mathematics</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto mb-6">
          Master Cambridge IGCSE Mathematics with interactive video lessons,
          step-by-step worked examples, and exam-style practice questions.
        </p>

        <div className="flex justify-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">99</div>
            <div className="text-sm text-slate-400">Topics</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-400">300+</div>
            <div className="text-sm text-slate-400">Video Lessons</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">1000+</div>
            <div className="text-sm text-slate-400">Practice Questions</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <Target className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Your Progress</p>
            <p className="text-xl font-bold text-white">0%</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Topics Completed</p>
            <p className="text-xl font-bold text-white">0 / 99</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Star className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Quiz Average</p>
            <p className="text-xl font-bold text-white">--</p>
          </div>
        </motion.div>
      </div>

      {/* Topic List */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Unit 1: Number</h2>
        <p className="text-slate-400 text-sm">Core concepts and foundations</p>
      </div>

      <div className="space-y-4">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.code}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {topic.available ? (
              <Link href={`/lesson/${topic.code.toLowerCase()}`}>
                <div className="glass-card p-5 hover:border-indigo-500/50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                          {topic.code}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {topic.duration} min
                        </span>
                      </div>
                      <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-slate-400 truncate">
                        {topic.description}
                      </p>
                    </div>

                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </div>

                  {/* Progress bar */}
                  {topic.progress > 0 && (
                    <div className="mt-4 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{ width: `${topic.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </Link>
            ) : (
              <div className="glass-card p-5 opacity-60 cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-slate-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-700 text-slate-500">
                        {topic.code}
                      </span>
                      <span className="text-xs text-slate-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {topic.duration} min
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-400">{topic.title}</h3>
                    <p className="text-sm text-slate-500 truncate">
                      Coming soon...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
