'use client';

import { useState } from 'react';
import { FileText, Book, GraduationCap, Users, Image, Loader2 } from 'lucide-react';

interface GenerationPanelProps {
  selectedProject?: string;
}

export function GenerationPanel({ selectedProject }: GenerationPanelProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'sop' | 'lesson' | 'training'>('manual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Form states
  const [manualForm, setManualForm] = useState({
    repoUrl: '',
    features: '',
    title: '',
    subtitle: '',
  });

  const [sopForm, setSopForm] = useState({
    task: '',
    category: '',
    industry: '',
    frequency: 'daily',
  });

  const [lessonForm, setLessonForm] = useState({
    topic: '',
    syllabus: 'cambridge-igcse',
    difficulty: 'foundation',
    includeExercises: true,
  });

  const [trainingForm, setTrainingForm] = useState({
    topic: '',
    audience: '',
    duration: '1 hour',
    format: 'presentation',
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      let endpoint = '';
      let body: any = {};

      switch (activeTab) {
        case 'manual':
          endpoint = '/api/generate/user-manual';
          body = {
            ...manualForm,
            features: manualForm.features.split(',').map((f) => f.trim()),
            targetProject: selectedProject,
          };
          break;

        case 'sop':
          endpoint = '/api/generate/sop';
          body = { ...sopForm, targetProject: selectedProject };
          break;

        case 'lesson':
          endpoint = '/api/generate/lesson';
          body = { ...lessonForm, targetProject: selectedProject };
          break;

        case 'training':
          endpoint = '/api/generate/training';
          body = { ...trainingForm, targetProject: selectedProject };
          break;
      }

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Generation error:', error);
      setResult({ error: 'Failed to generate content' });
    } finally {
      setIsGenerating(false);
    }
  };

  const tabs = [
    { id: 'manual', label: 'User Manual', icon: FileText },
    { id: 'sop', label: 'SOP', icon: Book },
    { id: 'lesson', label: 'Lesson', icon: GraduationCap },
    { id: 'training', label: 'Training', icon: Users },
  ];

  return (
    <div className="glass-panel flex flex-col h-full rounded-3xl border border-slate-200/70 bg-white/85 p-4 shadow-[0_18px_48px_-30px_rgba(15,23,42,0.5)] backdrop-blur-2xl transition-all duration-500 dark:border-white/10 dark:bg-slate-900/75 dark:shadow-[0_25px_60px_-35px_rgba(0,0,0,0.85)]">
      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-teal-300 bg-teal-500/20 text-teal-700 shadow-sm dark:border-cyan-400/60 dark:bg-cyan-500/20 dark:text-cyan-100'
                  : 'border-slate-200/60 bg-white/70 text-slate-600 hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {activeTab === 'manual' && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/80">Repository URL</label>
              <input
                type="text"
                value={manualForm.repoUrl}
                onChange={(e) => setManualForm({ ...manualForm, repoUrl: e.target.value })}
                placeholder="https://github.com/user/repo"
                className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-slate-800 placeholder:text-slate-400 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-white/10 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-white/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/80">Features (comma-separated)</label>
              <input
                type="text"
                value={manualForm.features}
                onChange={(e) => setManualForm({ ...manualForm, features: e.target.value })}
                placeholder="Auth, Dashboard, Reports"
                className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-slate-800 placeholder:text-slate-400 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-white/10 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-white/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/80">Title</label>
              <input
                type="text"
                value={manualForm.title}
                onChange={(e) => setManualForm({ ...manualForm, title: e.target.value })}
                placeholder="My App User Manual"
                className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-slate-800 placeholder:text-slate-400 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-white/10 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-white/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/80">Subtitle (optional)</label>
              <input
                type="text"
                value={manualForm.subtitle}
                onChange={(e) => setManualForm({ ...manualForm, subtitle: e.target.value })}
                placeholder="Complete Guide"
                className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-slate-800 placeholder:text-slate-400 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-white/10 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-white/50"
              />
            </div>
          </>
        )}

        {activeTab === 'sop' && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/80">Task</label>
              <input
                type="text"
                value={sopForm.task}
                onChange={(e) => setSopForm({ ...sopForm, task: e.target.value })}
                placeholder="Hand Washing Procedure"
                className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-slate-800 placeholder:text-slate-400 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-white/10 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-white/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/80">Category</label>
              <input
                type="text"
                value={sopForm.category}
                onChange={(e) => setSopForm({ ...sopForm, category: e.target.value })}
                placeholder="Hygiene"
                className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-slate-800 placeholder:text-slate-400 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-white/10 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-white/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/80">Industry</label>
              <input
                type="text"
                value={sopForm.industry}
                onChange={(e) => setSopForm({ ...sopForm, industry: e.target.value })}
                placeholder="Food Service"
                className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-slate-800 placeholder:text-slate-400 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-white/10 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-white/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/80">Frequency</label>
              <select
                value={sopForm.frequency}
                onChange={(e) => setSopForm({ ...sopForm, frequency: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-slate-800 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-white/10 dark:bg-slate-800/80 dark:text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </>
        )}

        {activeTab === 'lesson' && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/80">Topic</label>
              <input
                type="text"
                value={lessonForm.topic}
                onChange={(e) => setLessonForm({ ...lessonForm, topic: e.target.value })}
                placeholder="Quadratic Equations"
                className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-slate-800 placeholder:text-slate-400 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-white/10 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-white/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/80">Syllabus</label>
              <select
                value={lessonForm.syllabus}
                onChange={(e) => setLessonForm({ ...lessonForm, syllabus: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-slate-800 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-white/10 dark:bg-slate-800/80 dark:text-white"
              >
                <option value="cambridge-igcse">Cambridge IGCSE</option>
                <option value="edexcel-igcse">Edexcel IGCSE</option>
                <option value="o-level">O Level</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/80">Difficulty</label>
              <select
                value={lessonForm.difficulty}
                onChange={(e) => setLessonForm({ ...lessonForm, difficulty: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-slate-800 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-white/10 dark:bg-slate-800/80 dark:text-white"
              >
                <option value="foundation">Foundation</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeExercises"
                checked={lessonForm.includeExercises}
                onChange={(e) => setLessonForm({ ...lessonForm, includeExercises: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-teal-500 transition focus:ring-teal-400 dark:border-white/30 dark:bg-slate-800"
              />
              <label htmlFor="includeExercises" className="text-sm text-slate-600 dark:text-white/80">
                Include Exercises
              </label>
            </div>
          </>
        )}

        {activeTab === 'training' && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/80">Topic</label>
              <input
                type="text"
                value={trainingForm.topic}
                onChange={(e) => setTrainingForm({ ...trainingForm, topic: e.target.value })}
                placeholder="Food Safety Basics"
                className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-slate-800 placeholder:text-slate-400 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-white/10 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-white/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/80">Audience</label>
              <input
                type="text"
                value={trainingForm.audience}
                onChange={(e) => setTrainingForm({ ...trainingForm, audience: e.target.value })}
                placeholder="Kitchen Staff"
                className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-slate-800 placeholder:text-slate-400 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-white/10 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-white/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/80">Duration</label>
              <select
                value={trainingForm.duration}
                onChange={(e) => setTrainingForm({ ...trainingForm, duration: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-slate-800 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-white/10 dark:bg-slate-800/80 dark:text-white"
              >
                <option value="30 minutes">30 minutes</option>
                <option value="1 hour">1 hour</option>
                <option value="2 hours">2 hours</option>
                <option value="half day">Half Day</option>
                <option value="full day">Full Day</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-white/80">Format</label>
              <select
                value={trainingForm.format}
                onChange={(e) => setTrainingForm({ ...trainingForm, format: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-slate-800 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-white/10 dark:bg-slate-800/80 dark:text-white"
              >
                <option value="presentation">Presentation</option>
                <option value="workshop">Workshop</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </>
        )}

        {/* Target Project */}
        {selectedProject && (
          <div className="rounded-xl border border-slate-200/60 bg-white/70 p-3 text-sm text-slate-600 transition-colors dark:border-white/10 dark:bg-white/5 dark:text-white/80">
            <p>
              Target Project: <span className="font-semibold text-teal-600 dark:text-white">{selectedProject}</span>
            </p>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 py-3 text-sm font-medium text-white shadow-[0_18px_40px_-25px_rgba(13,148,136,0.7)] transition hover:from-teal-400 hover:to-cyan-500 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 dark:shadow-[0_22px_50px_-28px_rgba(0,0,0,0.7)] dark:disabled:from-slate-600 dark:disabled:to-slate-600"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Image className="h-4 w-4" />
              Generate Content
            </>
          )}
        </button>

        {/* Result */}
        {result && (
          <div className="space-y-2 rounded-xl border border-slate-200/70 bg-white/85 p-4 shadow-[0_15px_40px_-28px_rgba(15,23,42,0.45)] transition-colors dark:border-white/10 dark:bg-slate-900/70 dark:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.85)]">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Result</h3>
            {result.error ? (
              <p className="text-sm text-red-500 dark:text-red-300">{result.error}</p>
            ) : (
              <>
                <p className="text-sm text-slate-600 dark:text-white/80">✅ Generated successfully!</p>
                {result.firebaseDocId && (
                  <p className="text-sm text-slate-500 dark:text-white/70">
                    Firebase Doc ID: {result.firebaseDocId}
                  </p>
                )}
                {result.metadata && (
                  <div className="space-y-1 text-sm text-slate-500 dark:text-white/70">
                    {result.metadata.slideCount && (
                      <p>Slides: {result.metadata.slideCount}</p>
                    )}
                    {result.metadata.duration && (
                      <p>Duration: {result.metadata.duration.toFixed(1)}s</p>
                    )}
                    {result.metadata.estimatedCost && (
                      <p>Cost: ${result.metadata.estimatedCost.toFixed(2)}</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}