'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Play,
  CheckCircle,
  Circle,
  ChevronRight,
  Clock,
  GraduationCap,
  FileText,
  Video,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  Target,
  PenTool
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface TheorySection {
  id: string;
  title: string;
  order: number;
  introduction?: string;
  keyQuestion?: string;
  content?: Array<{
    id: string;
    type: string;
    title: string;
    narrationText?: string;
    videoPath?: string;
    imagePath?: string;
  }>;
  keyDefinitions?: Array<{
    term: string;
    definition: string;
    example?: string;
  }>;
  keyPoints?: string[];
}

interface WorkedExample {
  id: string;
  difficulty: string;
  question: string;
  steps: Array<{
    stepNumber: number;
    instruction: string;
    working: string;
    explanation: string;
  }>;
  answer: string;
  examTip?: string;
}

interface Lesson {
  id: string;
  syllabusCode: string;
  title: string;
  level: 'Core' | 'Extended';
  estimatedDuration: number;
  opening?: {
    hook: string;
    realWorldConnection: string;
  };
  objectives?: Array<{
    id: string;
    description: string;
  }>;
  theorySections?: TheorySection[];
  workedExamples?: WorkedExample[];
  practiceQuestions?: Array<{
    id: string;
    question: string;
    correctAnswer: string;
    hint?: string;
  }>;
  quiz?: {
    title: string;
    passingScore: number;
    questions: Array<{
      id: string;
      question: string;
    }>;
  };
  summaryVideo?: {
    videoPath: string;
    duration: number;
  };
  summary?: {
    keyTakeaways: string[];
    examTips: string[];
  };
}

export default function LessonPage() {
  const params = useParams();
  const topicCode = params.topicCode as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'theory' | 'examples' | 'practice' | 'quiz'>('theory');
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    fetchLesson();
  }, [topicCode]);

  const fetchLesson = async () => {
    try {
      // Fetch from the lesson endpoint
      const res = await fetch(`${API_URL}/api/education/topics/${topicCode}/lesson`);
      const data = await res.json();
      if (data.success && data.lesson) {
        setLesson(data.lesson);
        // Set first theory section as active
        if (data.lesson.theorySections?.length > 0) {
          setActiveSection(data.lesson.theorySections[0].id);
        }
      } else {
        setError(data.error || 'Lesson not found');
      }
    } catch (err) {
      console.error('Failed to fetch lesson:', err);
      setError('Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const currentTheorySection = lesson?.theorySections?.find(s => s.id === activeSection);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link
          href="/education/learn"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Syllabus
        </Link>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          <HelpCircle size={48} className="mx-auto mb-4 text-zinc-600" />
          <h2 className="text-xl font-semibold mb-2">Lesson Not Available</h2>
          <p className="text-zinc-500 mb-4">
            {error || `The lesson for topic "${topicCode}" hasn't been created yet.`}
          </p>
          <Link
            href="/education/studio"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
          >
            <GraduationCap size={18} />
            Create in Studio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
        <Link href="/education/learn" className="hover:text-white transition-colors">
          Learn
        </Link>
        <ChevronRight size={14} />
        <span className="text-white">{lesson.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Lesson Info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className={`inline-block px-2 py-1 rounded text-xs mb-2 ${
              lesson.level === 'Core' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
            }`}>
              {lesson.level}
            </span>
            <h2 className="font-semibold mb-1">{lesson.syllabusCode}</h2>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Clock size={14} />
              <span>{lesson.estimatedDuration} min</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 grid grid-cols-2 gap-1">
            {(['theory', 'examples', 'practice', 'quiz'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-indigo-500 text-white'
                    : 'text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Theory Sections List */}
          {activeTab === 'theory' && lesson.theorySections && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="p-3 border-b border-zinc-800">
                <h3 className="font-semibold text-sm">Sections</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {lesson.theorySections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 p-3 text-left transition-colors border-b border-zinc-800 last:border-0 ${
                      activeSection === section.id
                        ? 'bg-indigo-500/10 border-l-2 border-l-indigo-500'
                        : 'hover:bg-zinc-800/50'
                    }`}
                  >
                    <BookOpen size={16} className="text-zinc-500 flex-shrink-0" />
                    <span className={`text-sm ${activeSection === section.id ? 'text-white' : 'text-zinc-300'}`}>
                      {section.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Learning Objectives */}
          {lesson.objectives && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Target size={16} className="text-indigo-400" />
                Objectives
              </h3>
              <ul className="space-y-2">
                {lesson.objectives.slice(0, 4).map((obj) => (
                  <li key={obj.id} className="flex items-start gap-2 text-sm text-zinc-400">
                    <CheckCircle size={14} className="flex-shrink-0 mt-0.5 text-zinc-600" />
                    {obj.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h1 className="text-2xl font-bold mb-3">{lesson.title}</h1>
            {lesson.opening && (
              <div className="space-y-3">
                <p className="text-zinc-300">{lesson.opening.hook}</p>
                <p className="text-sm text-zinc-500 italic">{lesson.opening.realWorldConnection}</p>
              </div>
            )}
          </div>

          {/* Theory Tab */}
          {activeTab === 'theory' && currentTheorySection && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">{currentTheorySection.title}</h2>

              {currentTheorySection.keyQuestion && (
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mb-6">
                  <p className="text-indigo-300 font-medium">Key Question: {currentTheorySection.keyQuestion}</p>
                </div>
              )}

              {currentTheorySection.introduction && (
                <p className="text-zinc-300 mb-6">{currentTheorySection.introduction}</p>
              )}

              {/* Key Definitions */}
              {currentTheorySection.keyDefinitions && currentTheorySection.keyDefinitions.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <BookOpen size={16} className="text-emerald-400" />
                    Key Definitions
                  </h3>
                  <div className="space-y-3">
                    {currentTheorySection.keyDefinitions.map((def, i) => (
                      <div key={i} className="bg-zinc-800/50 rounded-lg p-4">
                        <p className="font-medium text-emerald-400">{def.term}</p>
                        <p className="text-zinc-300 mt-1">{def.definition}</p>
                        {def.example && (
                          <p className="text-sm text-zinc-500 mt-2">Example: {def.example}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Points */}
              {currentTheorySection.keyPoints && currentTheorySection.keyPoints.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb size={16} className="text-amber-400" />
                    Key Points
                  </h3>
                  <ul className="space-y-2">
                    {currentTheorySection.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-zinc-300">
                        <CheckCircle size={16} className="flex-shrink-0 mt-0.5 text-amber-400" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-800">
                <button
                  onClick={() => {
                    const sections = lesson.theorySections || [];
                    const idx = sections.findIndex(s => s.id === activeSection);
                    if (idx > 0) setActiveSection(sections[idx - 1].id);
                  }}
                  disabled={lesson.theorySections?.findIndex(s => s.id === activeSection) === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft size={16} />
                  Previous
                </button>
                <button
                  onClick={() => {
                    const sections = lesson.theorySections || [];
                    const idx = sections.findIndex(s => s.id === activeSection);
                    if (idx < sections.length - 1) {
                      setActiveSection(sections[idx + 1].id);
                    }
                  }}
                  disabled={(lesson.theorySections?.findIndex(s => s.id === activeSection) || 0) === (lesson.theorySections?.length || 1) - 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Examples Tab */}
          {activeTab === 'examples' && (
            <div className="space-y-6">
              {lesson.workedExamples?.map((example) => (
                <div key={example.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      example.difficulty === 'foundation' ? 'bg-green-500/20 text-green-400' :
                      example.difficulty === 'core' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {example.difficulty}
                    </span>
                    <PenTool size={16} className="text-zinc-500" />
                  </div>

                  <p className="font-medium text-lg mb-4">{example.question}</p>

                  <div className="space-y-4">
                    {example.steps.map((step) => (
                      <div key={step.stepNumber} className="bg-zinc-800/50 rounded-lg p-4">
                        <p className="text-sm text-indigo-400 mb-1">Step {step.stepNumber}: {step.instruction}</p>
                        <p className="font-mono text-zinc-300 mb-2">{step.working}</p>
                        <p className="text-sm text-zinc-500">{step.explanation}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <p className="font-medium text-emerald-400">Answer: {example.answer}</p>
                  </div>

                  {example.examTip && (
                    <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <p className="text-sm text-amber-400">
                        <AlertTriangle size={14} className="inline mr-2" />
                        Exam Tip: {example.examTip}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {(!lesson.workedExamples || lesson.workedExamples.length === 0) && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
                  <FileText size={48} className="mx-auto mb-4 text-zinc-600" />
                  <p className="text-zinc-500">No worked examples available yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Practice Tab */}
          {activeTab === 'practice' && (
            <div className="space-y-4">
              {lesson.practiceQuestions?.map((q, i) => (
                <div key={q.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <p className="font-medium mb-4">Q{i + 1}. {q.question}</p>
                  {q.hint && (
                    <p className="text-sm text-zinc-500 mb-4">
                      <Lightbulb size={14} className="inline mr-2" />
                      Hint: {q.hint}
                    </p>
                  )}
                  <details className="mt-4">
                    <summary className="cursor-pointer text-indigo-400 hover:text-indigo-300">
                      Show Answer
                    </summary>
                    <p className="mt-2 p-4 bg-zinc-800 rounded-lg font-mono">{q.correctAnswer}</p>
                  </details>
                </div>
              ))}

              {(!lesson.practiceQuestions || lesson.practiceQuestions.length === 0) && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
                  <FileText size={48} className="mx-auto mb-4 text-zinc-600" />
                  <p className="text-zinc-500">No practice questions available yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
              {lesson.quiz ? (
                <>
                  <HelpCircle size={48} className="mx-auto mb-4 text-indigo-400" />
                  <h2 className="text-xl font-semibold mb-2">{lesson.quiz.title}</h2>
                  <p className="text-zinc-500 mb-6">
                    {lesson.quiz.questions.length} questions • Pass mark: {lesson.quiz.passingScore}%
                  </p>
                  <button className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-medium transition-colors">
                    Start Quiz
                  </button>
                </>
              ) : (
                <>
                  <HelpCircle size={48} className="mx-auto mb-4 text-zinc-700" />
                  <h2 className="text-xl font-semibold mb-2">No Quiz Available</h2>
                  <p className="text-zinc-500">A quiz for this topic hasn't been created yet.</p>
                </>
              )}
            </div>
          )}

          {/* Summary Section */}
          {lesson.summary && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <GraduationCap size={18} className="text-indigo-400" />
                Key Takeaways
              </h3>
              <ul className="space-y-2 mb-6">
                {lesson.summary.keyTakeaways.slice(0, 5).map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-zinc-300">
                    <CheckCircle size={16} className="flex-shrink-0 mt-0.5 text-emerald-400" />
                    {point}
                  </li>
                ))}
              </ul>

              {lesson.summary.examTips && lesson.summary.examTips.length > 0 && (
                <>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-400" />
                    Exam Tips
                  </h4>
                  <ul className="space-y-2">
                    {lesson.summary.examTips.slice(0, 3).map((tip, i) => (
                      <li key={i} className="text-sm text-amber-300/80">{tip}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
