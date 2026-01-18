'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  Target,
  AlertTriangle,
  Lightbulb,
  PenTool,
  HelpCircle,
  Trophy,
  ChevronDown,
  ChevronUp,
  Play,
  RotateCcw
} from 'lucide-react';
import { BlockMath } from 'react-katex';
import { InteractiveVennDiagram } from '@/components/interactive-venn-diagram';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Interfaces
interface ContentBlock {
  id: string;
  type: string;
  title?: string;
  description?: string;
  narrationText?: string;
  imagePath?: string;
  videoPath?: string;
  latex?: string;
  interactiveType?: string;
  interactiveConfig?: any;
}

interface TheorySection {
  id: string;
  title: string;
  order: number;
  introduction: string;
  keyQuestion?: string;
  content: ContentBlock[];
  keyDefinitions?: { term: string; definition: string; example?: string }[];
  keyPoints: string[];
}

interface Lesson {
  id: string;
  syllabusCode: string;
  title: string;
  level: string;
  estimatedDuration: number;
  opening: { hook: string; realWorldConnection: string };
  objectives: { id: string; description: string; verb: string }[];
  theorySections: TheorySection[];
  misconceptions: { id: string; wrongIdea: string; whyWrong: string; correctUnderstanding: string }[];
  workedExamples: any[];
  practiceQuestions: any[];
  quiz: { title: string; passingScore: number; questions: any[] };
  summary: { keyTakeaways: string[]; examTips: string[] };
}

type SectionType = 'overview' | 'learn' | 'practice' | 'quiz';

export default function LessonPage() {
  const params = useParams();
  const code = params.code as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionType>('overview');
  const [activeTheoryIndex, setActiveTheoryIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  useEffect(() => {
    fetchLesson();
  }, [code]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      // Fetch from backend API
      const res = await fetch(`${API_URL}/api/education/topics/${code}/lesson`);
      const data = await res.json();

      if (data.success && data.lesson) {
        setLesson(data.lesson);
      }
    } catch (err) {
      console.error('Failed to fetch lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const submitQuiz = () => {
    if (!lesson) return;

    let correct = 0;
    lesson.quiz.questions.forEach(q => {
      const answer = quizAnswers[q.id];
      if (q.questionType === 'multiple-choice') {
        const correctOption = q.options?.find((o: any) => o.isCorrect);
        if (answer === correctOption?.value) correct++;
      } else if (answer === q.correctAnswer) {
        correct++;
      }
    });

    setQuizScore(Math.round((correct / lesson.quiz.questions.length) * 100));
    setQuizSubmitted(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="mb-4"
          >
            <BookOpen className="w-10 h-10 text-indigo-400" />
          </motion.div>
          <p className="text-slate-400">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-card p-8 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Lesson Not Found</h2>
          <p className="text-slate-400 mb-6">
            This lesson is not available yet.
          </p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Topics
          </Link>
        </div>
      </div>
    );
  }

  const sections: { id: SectionType; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'learn', label: 'Learn', icon: Lightbulb },
    { id: 'practice', label: 'Practice', icon: PenTool },
    { id: 'quiz', label: 'Quiz', icon: Trophy },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Topics
      </Link>

      {/* Header */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-semibold px-2 py-1 rounded bg-indigo-500/20 text-indigo-400">
            {lesson.syllabusCode}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lesson.estimatedDuration} min
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
      </div>

      {/* Navigation */}
      <div className="glass-card p-2 mb-6">
        <div className="flex gap-1">
          {sections.map(section => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Overview */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Why Learn This?</h2>
                <p className="text-slate-300 leading-relaxed">{lesson.opening.hook}</p>
              </div>

              <div className="glass-card p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                <h2 className="text-lg font-semibold text-white mb-4">Real-World Connection</h2>
                <p className="text-slate-300 leading-relaxed">{lesson.opening.realWorldConnection}</p>
              </div>

              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-400" />
                  What You'll Learn
                </h2>
                <div className="space-y-3">
                  {lesson.objectives.map((obj, i) => (
                    <div key={obj.id} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                        {i + 1}
                      </div>
                      <p className="text-slate-300">{obj.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveSection('learn')}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Start Learning
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Learn */}
          {activeSection === 'learn' && (
            <div className="flex gap-6">
              {/* Sidebar */}
              <div className="w-64 flex-shrink-0">
                <div className="glass-card p-4 sticky top-24">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Sections
                  </h3>
                  <div className="space-y-1">
                    {lesson.theorySections.map((section, i) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveTheoryIndex(i)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                          activeTheoryIndex === i
                            ? 'bg-indigo-500 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                      >
                        <span className="w-5 h-5 rounded bg-slate-700 flex items-center justify-center text-xs font-medium">
                          {i + 1}
                        </span>
                        <span className="truncate">{section.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                {lesson.theorySections[activeTheoryIndex] && (
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white mb-2">
                      {lesson.theorySections[activeTheoryIndex].title}
                    </h2>

                    {lesson.theorySections[activeTheoryIndex].keyQuestion && (
                      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 mb-6">
                        <p className="text-indigo-300 italic">
                          Key Question: {lesson.theorySections[activeTheoryIndex].keyQuestion}
                        </p>
                      </div>
                    )}

                    <p className="text-slate-300 leading-relaxed mb-6">
                      {lesson.theorySections[activeTheoryIndex].introduction}
                    </p>

                    {/* Content Blocks */}
                    <div className="space-y-6">
                      {lesson.theorySections[activeTheoryIndex].content?.map(block => (
                        <div key={block.id} className="rounded-xl overflow-hidden bg-slate-800/50 border border-slate-700">
                          {/* Video */}
                          {(block.type === 'manim-animation' || block.type === 'svg-animation') && block.videoPath && (
                            <div>
                              <video
                                controls
                                className="w-full aspect-video bg-black"
                              >
                                <source src={`${API_URL}${block.videoPath}`} type="video/mp4" />
                              </video>
                              {block.title && (
                                <div className="p-4">
                                  <h4 className="font-semibold text-white mb-1">{block.title}</h4>
                                  {block.narrationText && (
                                    <p className="text-sm text-slate-400">{block.narrationText}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Image/Diagram */}
                          {block.type === 'gemini-diagram' && (
                            <div>
                              {block.imagePath ? (
                                <img
                                  src={`${API_URL}${block.imagePath}`}
                                  alt={block.title || 'Diagram'}
                                  className="w-full"
                                />
                              ) : (
                                <div className="aspect-video bg-gradient-to-br from-indigo-900/50 to-purple-900/50 flex items-center justify-center">
                                  <p className="text-slate-400">Visual diagram</p>
                                </div>
                              )}
                              {block.title && (
                                <div className="p-4">
                                  <h4 className="font-semibold text-white mb-1">{block.title}</h4>
                                  {block.narrationText && (
                                    <p className="text-sm text-slate-400">{block.narrationText}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* LaTeX */}
                          {block.type === 'latex-formula' && block.latex && (
                            <div className="p-6">
                              {block.title && (
                                <h4 className="text-indigo-400 font-medium mb-4 text-sm">{block.title}</h4>
                              )}
                              <div className="bg-slate-900 rounded-xl p-6 text-center text-xl text-white">
                                <BlockMath math={block.latex} />
                              </div>
                              {block.narrationText && (
                                <p className="text-sm text-slate-400 mt-4">{block.narrationText}</p>
                              )}
                            </div>
                          )}

                          {/* Interactive Venn Diagram */}
                          {block.type === 'interactive' && block.interactiveType === 'venn' && block.interactiveConfig && (
                            <div className="p-6">
                              {block.title && (
                                <h4 className="text-green-400 font-semibold mb-4">{block.title}</h4>
                              )}
                              {block.interactiveConfig.type === 'two-sets' && (
                                <InteractiveVennDiagram
                                  setA={{ label: 'A', color: '#ef4444' }}
                                  setB={{ label: 'B', color: '#22c55e' }}
                                  elements={(() => {
                                    const config = block.interactiveConfig!;
                                    const setA = new Set(config.setA || []);
                                    const setB = new Set(config.setB || []);
                                    const universal = config.universalSet || [];

                                    return universal.map((val: number) => {
                                      const inA = setA.has(val);
                                      const inB = setB.has(val);
                                      let correctRegion: 'onlyA' | 'onlyB' | 'intersection' | 'outside';

                                      if (inA && inB) correctRegion = 'intersection';
                                      else if (inA) correctRegion = 'onlyA';
                                      else if (inB) correctRegion = 'onlyB';
                                      else correctRegion = 'outside';

                                      return {
                                        id: `el-${val}`,
                                        value: val,
                                        correctRegion
                                      };
                                    });
                                  })()}
                                  onComplete={(isCorrect, score) => {
                                    console.log('Venn exercise complete:', { isCorrect, score });
                                  }}
                                />
                              )}
                              {block.interactiveConfig.type === 'single-set' && (
                                <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
                                  <p className="text-slate-400 mb-4">Complement Explorer</p>
                                  <div className="flex flex-wrap gap-2 justify-center">
                                    {block.interactiveConfig.universalSet?.map((val: number) => {
                                      const inSet = block.interactiveConfig!.setA?.includes(val);
                                      return (
                                        <span
                                          key={val}
                                          className={`px-4 py-2 rounded-full font-semibold ${
                                            inSet
                                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                              : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                                          }`}
                                        >
                                          {val} {inSet ? '∈ A' : "∈ A'"}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                              {block.narrationText && (
                                <p className="text-sm text-slate-400 mt-4">{block.narrationText}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Key Definitions */}
                    {lesson.theorySections[activeTheoryIndex]?.keyDefinitions?.length && lesson.theorySections[activeTheoryIndex]?.keyDefinitions?.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-white mb-4">Key Definitions</h3>
                        <div className="space-y-3">
                          {lesson.theorySections[activeTheoryIndex]?.keyDefinitions?.map((def, i) => (
                            <div key={i} className="p-4 rounded-xl bg-slate-800/50 border-l-4 border-indigo-500">
                              <div className="font-semibold text-indigo-400 mb-1">{def.term}</div>
                              <p className="text-slate-300">{def.definition}</p>
                              {def.example && (
                                <p className="text-sm text-slate-500 mt-2">
                                  <strong>Example:</strong> {def.example}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Points */}
                    {lesson.theorySections[activeTheoryIndex]?.keyPoints?.length && lesson.theorySections[activeTheoryIndex]?.keyPoints?.length > 0 && (
                      <div className="mt-8 p-5 rounded-xl bg-green-500/10 border border-green-500/30">
                        <h3 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Key Points
                        </h3>
                        <ul className="space-y-2">
                          {lesson.theorySections[activeTheoryIndex].keyPoints.map((point, i) => (
                            <li key={i} className="text-slate-300 flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
                      <button
                        onClick={() => setActiveTheoryIndex(i => Math.max(0, i - 1))}
                        disabled={activeTheoryIndex === 0}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                          activeTheoryIndex === 0
                            ? 'text-slate-600 cursor-not-allowed'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700'
                        }`}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                      </button>
                      <button
                        onClick={() => {
                          if (activeTheoryIndex < lesson.theorySections.length - 1) {
                            setActiveTheoryIndex(i => i + 1);
                          } else {
                            setActiveSection('practice');
                          }
                        }}
                        className="btn-primary flex items-center gap-2"
                      >
                        {activeTheoryIndex < lesson.theorySections.length - 1 ? 'Next' : 'Start Practice'}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Practice */}
          {activeSection === 'practice' && (
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-2">Practice Questions</h2>
                <p className="text-slate-400">Test your understanding with these practice questions.</p>
              </div>

              {lesson.practiceQuestions.map((q, i) => (
                <PracticeQuestion key={q.id} question={q} index={i} />
              ))}

              <button
                onClick={() => setActiveSection('quiz')}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Take the Quiz
                <Trophy className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Quiz */}
          {activeSection === 'quiz' && (
            <div className="glass-card p-6">
              {!quizSubmitted ? (
                <>
                  <div className="text-center mb-8">
                    <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">{lesson.quiz.title}</h2>
                    <p className="text-slate-400">
                      Score {lesson.quiz.passingScore}% or higher to pass
                    </p>
                  </div>

                  <div className="space-y-6">
                    {lesson.quiz.questions.map((q: any, i: number) => (
                      <div key={q.id} className="p-5 rounded-xl bg-slate-800/50 border border-slate-700">
                        <p className="text-sm text-slate-500 mb-2">Question {i + 1}</p>
                        <p className="text-white mb-4">{q.question}</p>

                        {q.questionType === 'multiple-choice' && (
                          <div className="space-y-2">
                            {q.options?.map((opt: any, j: number) => (
                              <button
                                key={j}
                                onClick={() => handleQuizAnswer(q.id, opt.value)}
                                className={`w-full p-3 rounded-lg text-left transition-all ${
                                  quizAnswers[q.id] === opt.value
                                    ? 'bg-indigo-500/20 border-2 border-indigo-500 text-white'
                                    : 'bg-slate-700/50 border-2 border-transparent text-slate-300 hover:border-slate-600'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={submitQuiz}
                    className="btn-primary w-full mt-8"
                  >
                    Submit Quiz
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  {quizScore !== null && quizScore >= lesson.quiz.passingScore ? (
                    <>
                      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-10 h-10 text-green-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2">{quizScore}%</h2>
                      <p className="text-green-400 text-lg font-semibold mb-6">
                        Congratulations! You passed!
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                        <RotateCcw className="w-10 h-10 text-amber-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2">{quizScore}%</h2>
                      <p className="text-amber-400 text-lg font-semibold mb-6">
                        Keep practicing! You need {lesson.quiz.passingScore}% to pass.
                      </p>
                    </>
                  )}

                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setQuizScore(null);
                      setQuizAnswers({});
                    }}
                    className="btn-primary"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Practice Question Component
function PracticeQuestion({ question, index }: { question: any; index: number }) {
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);

  const checkAnswer = () => {
    setShowResult(true);
  };

  const isCorrect = () => {
    if (question.questionType === 'multiple-choice') {
      const correctOption = question.options?.find((o: any) => o.isCorrect);
      return answer === correctOption?.value;
    }
    return answer === question.correctAnswer || question.acceptableAnswers?.includes(answer);
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-sm font-bold text-white">
          {index + 1}
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-700 text-slate-400">
          {question.difficulty}
        </span>
      </div>

      <p className="text-white mb-4">{question.question}</p>

      {question.questionType === 'multiple-choice' && (
        <div className="space-y-2 mb-4">
          {question.options?.map((opt: any, j: number) => {
            const isSelected = answer === opt.value;
            const isOptionCorrect = opt.isCorrect;

            let bg = 'bg-slate-700/50 border-transparent';
            if (showResult && isSelected) {
              bg = isOptionCorrect ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500';
            } else if (showResult && isOptionCorrect) {
              bg = 'bg-green-500/10 border-green-500/50';
            } else if (isSelected) {
              bg = 'bg-indigo-500/20 border-indigo-500';
            }

            return (
              <button
                key={j}
                onClick={() => !showResult && setAnswer(opt.value)}
                disabled={showResult}
                className={`w-full p-3 rounded-lg text-left transition-all border-2 ${bg} ${
                  showResult ? 'cursor-default' : 'hover:border-slate-600'
                }`}
              >
                <span className="text-slate-300">{opt.label}</span>
                {showResult && isOptionCorrect && (
                  <CheckCircle className="w-5 h-5 text-green-400 float-right" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {!showResult ? (
        <button
          onClick={checkAnswer}
          disabled={!answer}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            answer
              ? 'bg-indigo-500 text-white hover:bg-indigo-600'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          Check Answer
        </button>
      ) : (
        <div
          className={`p-4 rounded-lg ${
            isCorrect() ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
          }`}
        >
          {isCorrect() ? question.feedbackCorrect : question.feedbackIncorrect}
        </div>
      )}
    </div>
  );
}
