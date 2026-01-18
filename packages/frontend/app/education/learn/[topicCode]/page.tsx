'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Play,
  Pause,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Clock,
  GraduationCap,
  FileText,
  Video,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  Target,
  PenTool,
  Volume2,
  VolumeX,
  Maximize2,
  Image as ImageIcon
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Content item types
interface ContentItem {
  id: string;
  type: 'gemini-diagram' | 'svg-animation' | 'latex-formula' | 'text' | 'manim-animation' | 'interactive';
  title: string;
  description?: string;
  narrationText?: string;
  videoPath?: string;
  imagePath?: string;
  latex?: string;
  formulaName?: string;
  style?: string;
  animationDuration?: number;
}

interface TheorySection {
  id: string;
  title: string;
  order: number;
  introduction?: string;
  keyQuestion?: string;
  content?: ContentItem[];
  keyDefinitions?: Array<{
    term: string;
    definition: string;
    example?: string;
  }>;
  keyFormulas?: Array<{
    name: string;
    latex: string;
    explanation?: string;
    whenToUse?: string;
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
  preferredStyle?: string;
  opening?: {
    hook: string;
    realWorldConnection: string;
  };
  objectives?: Array<{
    id: string;
    description: string;
    verb?: string;
    assessable?: boolean;
    examWeight?: string;
  }>;
  priorKnowledge?: Array<{
    topicCode: string;
    topicTitle: string;
    specificConcepts?: string[];
    checkQuestion?: string;
  }>;
  theorySections?: TheorySection[];
  workedExamples?: WorkedExample[];
  practiceQuestions?: Array<{
    id: string;
    question: string;
    correctAnswer: string;
    hint?: string;
    difficulty?: string;
  }>;
  quiz?: {
    title: string;
    passingScore: number;
    questions: Array<{
      id: string;
      question: string;
      options?: Array<{ label: string; value: string; isCorrect?: boolean }>;
    }>;
  };
  summary?: {
    keyTakeaways: string[];
    examTips: string[];
  };
}

// Video Player Component
function VideoPlayer({ src, title }: { src: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const fullVideoUrl = src.startsWith('http') ? src : `${API_URL}${src}`;

  return (
    <div className="relative bg-black rounded-xl overflow-hidden group">
      <video
        ref={videoRef}
        src={fullVideoUrl}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        muted={isMuted}
        playsInline
      />

      {/* Video Controls Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white ml-1" />
          )}
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-4">
          {/* Progress Bar */}
          <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-white hover:text-indigo-400 transition-colors"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => videoRef.current?.requestFullscreen()}
            className="text-white hover:text-indigo-400 transition-colors"
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </div>

      {/* Play Button Overlay (when not playing) */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-20 h-20 rounded-full bg-indigo-500/90 flex items-center justify-center shadow-lg">
            <Play className="w-10 h-10 text-white ml-1" />
          </div>
        </div>
      )}
    </div>
  );
}

// Image Component with loading state
function LessonImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const fullImageUrl = src.startsWith('http') ? src : `${API_URL}${src}`;

  if (error) {
    return (
      <div className="w-full aspect-video bg-zinc-800 rounded-xl flex items-center justify-center">
        <div className="text-center text-zinc-500">
          <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
          <p>Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-zinc-800">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
        </div>
      )}
      <img
        src={fullImageUrl}
        alt={alt}
        className={`w-full transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
}

// LaTeX Renderer using KaTeX
function LaTeXFormula({ latex, name }: { latex: string; name?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    // Load KaTeX if not already loaded
    if (typeof window !== 'undefined' && !(window as any).katex) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
      script.async = true;
      script.onload = () => renderLatex();
      document.head.appendChild(script);
    } else {
      renderLatex();
    }
  }, [latex]);

  const renderLatex = () => {
    if (containerRef.current && (window as any).katex) {
      try {
        (window as any).katex.render(latex, containerRef.current, {
          throwOnError: false,
          displayMode: true
        });
        setRendered(true);
      } catch (e) {
        // Fallback to showing raw LaTeX as text
        if (containerRef.current) {
          containerRef.current.textContent = latex;
        }
        setRendered(true);
      }
    }
  };

  return (
    <div className="bg-zinc-800/50 rounded-xl p-6">
      {name && (
        <p className="text-sm text-indigo-400 mb-3 font-medium">{name}</p>
      )}
      <div ref={containerRef} className="text-xl text-white overflow-x-auto">
        {!rendered && <code className="text-zinc-400">{latex}</code>}
      </div>
    </div>
  );
}

// Content Item Renderer
function ContentRenderer({ item }: { item: ContentItem }) {
  switch (item.type) {
    case 'svg-animation':
    case 'manim-animation':
      return (
        <div className="space-y-3">
          <h4 className="font-medium text-white flex items-center gap-2">
            <Video size={18} className="text-indigo-400" />
            {item.title}
          </h4>
          {item.videoPath && (
            <VideoPlayer src={item.videoPath} title={item.title} />
          )}
          {item.narrationText && (
            <p className="text-zinc-400 text-sm italic bg-zinc-800/30 p-4 rounded-lg border-l-2 border-indigo-500">
              {item.narrationText}
            </p>
          )}
        </div>
      );

    case 'gemini-diagram':
      return (
        <div className="space-y-3">
          <h4 className="font-medium text-white flex items-center gap-2">
            <ImageIcon size={18} className="text-emerald-400" />
            {item.title}
          </h4>
          {item.imagePath && (
            <LessonImage src={item.imagePath} alt={item.title} />
          )}
          {item.narrationText && (
            <p className="text-zinc-400 text-sm italic bg-zinc-800/30 p-4 rounded-lg border-l-2 border-emerald-500">
              {item.narrationText}
            </p>
          )}
        </div>
      );

    case 'latex-formula':
      return (
        <div className="space-y-3">
          <h4 className="font-medium text-white">{item.title}</h4>
          {item.latex && (
            <LaTeXFormula latex={item.latex} name={item.formulaName} />
          )}
          {item.narrationText && (
            <p className="text-zinc-400 text-sm">{item.narrationText}</p>
          )}
        </div>
      );

    default:
      return (
        <div className="bg-zinc-800/50 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">{item.title}</h4>
          {item.narrationText && (
            <p className="text-zinc-400">{item.narrationText}</p>
          )}
        </div>
      );
  }
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
      const res = await fetch(`${API_URL}/api/education/topics/${topicCode}/lesson`);
      const data = await res.json();
      if (data.success && data.lesson) {
        setLesson(data.lesson);
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
  const currentSectionIndex = lesson?.theorySections?.findIndex(s => s.id === activeSection) ?? 0;

  const goToPreviousSection = () => {
    const sections = lesson?.theorySections || [];
    if (currentSectionIndex > 0) {
      setActiveSection(sections[currentSectionIndex - 1].id);
    }
  };

  const goToNextSection = () => {
    const sections = lesson?.theorySections || [];
    if (currentSectionIndex < sections.length - 1) {
      setActiveSection(sections[currentSectionIndex + 1].id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4" />
          <p className="text-zinc-500">Loading lesson...</p>
        </div>
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
    <div className="max-w-7xl mx-auto">
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
          {/* Lesson Info Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                lesson.level === 'Core' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
              }`}>
                {lesson.level}
              </span>
              {lesson.preferredStyle && (
                <span className="px-2 py-1 rounded text-xs bg-zinc-800 text-zinc-400">
                  {lesson.preferredStyle}
                </span>
              )}
            </div>
            <h2 className="font-semibold text-lg mb-1">{lesson.syllabusCode}</h2>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Clock size={14} />
              <span>{lesson.estimatedDuration} min</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2">
            <div className="grid grid-cols-2 gap-1">
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
          </div>

          {/* Theory Sections Navigation */}
          {activeTab === 'theory' && lesson.theorySections && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="p-3 border-b border-zinc-800 bg-zinc-800/50">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <BookOpen size={14} className="text-indigo-400" />
                  Sections
                </h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {lesson.theorySections.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 p-3 text-left transition-colors border-b border-zinc-800/50 last:border-0 ${
                      activeSection === section.id
                        ? 'bg-indigo-500/10 border-l-2 border-l-indigo-500'
                        : 'hover:bg-zinc-800/50'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      activeSection === section.id
                        ? 'bg-indigo-500 text-white'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className={`text-sm flex-1 ${activeSection === section.id ? 'text-white' : 'text-zinc-300'}`}>
                      {section.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Learning Objectives */}
          {lesson.objectives && lesson.objectives.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Target size={14} className="text-indigo-400" />
                Learning Objectives
              </h3>
              <ul className="space-y-2">
                {lesson.objectives.slice(0, 5).map((obj) => (
                  <li key={obj.id} className="flex items-start gap-2 text-sm text-zinc-400">
                    <CheckCircle size={14} className="flex-shrink-0 mt-0.5 text-zinc-600" />
                    <span>{obj.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6">
            <h1 className="text-2xl font-bold mb-3">{lesson.title}</h1>
            {lesson.opening && (
              <div className="space-y-3">
                <p className="text-zinc-300 leading-relaxed">{lesson.opening.hook}</p>
                <div className="flex items-start gap-2 text-sm text-indigo-300/80 bg-indigo-500/10 p-3 rounded-lg">
                  <Lightbulb size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{lesson.opening.realWorldConnection}</span>
                </div>
              </div>
            )}
          </div>

          {/* Theory Tab Content */}
          {activeTab === 'theory' && currentTheorySection && (
            <div className="space-y-6">
              {/* Section Header */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                    {currentSectionIndex + 1}
                  </span>
                  <h2 className="text-xl font-semibold">{currentTheorySection.title}</h2>
                </div>

                {currentTheorySection.keyQuestion && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-4">
                    <p className="text-amber-300 font-medium flex items-center gap-2">
                      <HelpCircle size={18} />
                      {currentTheorySection.keyQuestion}
                    </p>
                  </div>
                )}

                {currentTheorySection.introduction && (
                  <p className="text-zinc-300 leading-relaxed">{currentTheorySection.introduction}</p>
                )}
              </div>

              {/* Content Items (Videos, Images, Formulas) */}
              {currentTheorySection.content && currentTheorySection.content.length > 0 && (
                <div className="space-y-6">
                  {currentTheorySection.content.map((item) => (
                    <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                      <ContentRenderer item={item} />
                    </div>
                  ))}
                </div>
              )}

              {/* Key Definitions */}
              {currentTheorySection.keyDefinitions && currentTheorySection.keyDefinitions.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BookOpen size={18} className="text-emerald-400" />
                    Key Definitions
                  </h3>
                  <div className="grid gap-4">
                    {currentTheorySection.keyDefinitions.map((def, i) => (
                      <div key={i} className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
                        <p className="font-medium text-emerald-400 mb-1">{def.term}</p>
                        <p className="text-zinc-300">{def.definition}</p>
                        {def.example && (
                          <p className="text-sm text-zinc-500 mt-2 font-mono bg-zinc-800/50 px-3 py-1 rounded inline-block">
                            {def.example}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Formulas */}
              {currentTheorySection.keyFormulas && currentTheorySection.keyFormulas.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-purple-400" />
                    Key Formulas
                  </h3>
                  <div className="space-y-4">
                    {currentTheorySection.keyFormulas.map((formula, i) => (
                      <div key={i} className="space-y-2">
                        <LaTeXFormula latex={formula.latex} name={formula.name} />
                        {formula.explanation && (
                          <p className="text-sm text-zinc-400">{formula.explanation}</p>
                        )}
                        {formula.whenToUse && (
                          <p className="text-sm text-indigo-400/80">
                            <span className="font-medium">When to use:</span> {formula.whenToUse}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Points */}
              {currentTheorySection.keyPoints && currentTheorySection.keyPoints.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb size={18} className="text-amber-400" />
                    Key Points
                  </h3>
                  <ul className="space-y-2">
                    {currentTheorySection.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-zinc-300">
                        <CheckCircle size={18} className="flex-shrink-0 mt-0.5 text-amber-400" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Section Navigation */}
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={goToPreviousSection}
                  disabled={currentSectionIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>

                <span className="text-sm text-zinc-500">
                  {currentSectionIndex + 1} of {lesson.theorySections?.length || 0}
                </span>

                <button
                  onClick={goToNextSection}
                  disabled={currentSectionIndex === (lesson.theorySections?.length || 1) - 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Examples Tab */}
          {activeTab === 'examples' && (
            <div className="space-y-6">
              {lesson.workedExamples?.map((example, idx) => (
                <div key={example.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="p-4 bg-zinc-800/50 border-b border-zinc-800 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      example.difficulty === 'foundation' ? 'bg-green-500/20 text-green-400' :
                      example.difficulty === 'core' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {example.difficulty}
                    </span>
                  </div>

                  <div className="p-6">
                    <p className="font-medium text-lg mb-6">{example.question}</p>

                    <div className="space-y-4">
                      {example.steps.map((step) => (
                        <div key={step.stepNumber} className="bg-zinc-800/50 rounded-lg p-4 border-l-2 border-indigo-500">
                          <p className="text-sm text-indigo-400 font-medium mb-2">
                            Step {step.stepNumber}: {step.instruction}
                          </p>
                          <p className="font-mono text-zinc-300 mb-2 text-lg">{step.working}</p>
                          <p className="text-sm text-zinc-500">{step.explanation}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <p className="font-medium text-emerald-400 flex items-center gap-2">
                        <CheckCircle size={18} />
                        Answer: {example.answer}
                      </p>
                    </div>

                    {example.examTip && (
                      <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <p className="text-sm text-amber-400 flex items-start gap-2">
                          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                          <span><strong>Exam Tip:</strong> {example.examTip}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {(!lesson.workedExamples || lesson.workedExamples.length === 0) && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
                  <PenTool size={48} className="mx-auto mb-4 text-zinc-600" />
                  <h3 className="text-lg font-semibold mb-2">No Worked Examples Yet</h3>
                  <p className="text-zinc-500">Worked examples for this topic haven't been created yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Practice Tab */}
          {activeTab === 'practice' && (
            <div className="space-y-4">
              {lesson.practiceQuestions?.map((q, i) => (
                <div key={q.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-medium">
                      {i + 1}
                    </span>
                    <p className="font-medium flex-1">{q.question}</p>
                  </div>

                  {q.hint && (
                    <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <p className="text-sm text-amber-400 flex items-center gap-2">
                        <Lightbulb size={14} />
                        <span><strong>Hint:</strong> {q.hint}</span>
                      </p>
                    </div>
                  )}

                  <details className="group">
                    <summary className="cursor-pointer text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-2">
                      <ChevronRight size={16} className="group-open:rotate-90 transition-transform" />
                      Show Answer
                    </summary>
                    <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <p className="font-mono text-emerald-400">{q.correctAnswer}</p>
                    </div>
                  </details>
                </div>
              ))}

              {(!lesson.practiceQuestions || lesson.practiceQuestions.length === 0) && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
                  <FileText size={48} className="mx-auto mb-4 text-zinc-600" />
                  <h3 className="text-lg font-semibold mb-2">No Practice Questions Yet</h3>
                  <p className="text-zinc-500">Practice questions for this topic haven't been created yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
              {lesson.quiz ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                    <HelpCircle size={32} className="text-indigo-400" />
                  </div>
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
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                    <HelpCircle size={32} className="text-zinc-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">No Quiz Available</h2>
                  <p className="text-zinc-500">A quiz for this topic hasn't been created yet.</p>
                </>
              )}
            </div>
          )}

          {/* Summary Section */}
          {lesson.summary && (
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <GraduationCap size={20} className="text-emerald-400" />
                Key Takeaways
              </h3>
              <ul className="space-y-2 mb-6">
                {lesson.summary.keyTakeaways.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-300">
                    <CheckCircle size={18} className="flex-shrink-0 mt-0.5 text-emerald-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {lesson.summary.examTips && lesson.summary.examTips.length > 0 && (
                <>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-amber-400">
                    <AlertTriangle size={16} />
                    Exam Tips
                  </h4>
                  <ul className="space-y-2">
                    {lesson.summary.examTips.map((tip, i) => (
                      <li key={i} className="text-sm text-amber-300/80 pl-6">• {tip}</li>
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
