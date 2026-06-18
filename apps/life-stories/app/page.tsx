'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FileText,
  Film,
  Image as ImageIcon,
  Play,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Clock,
  MapPin,
  User,
  Loader2,
  Check,
  Download,
  RefreshCw,
  Video,
  Clapperboard,
  DollarSign,
  Save,
  CloudOff,
  Cloud,
  Upload,
  Sparkles,
  Bot,
  Terminal,
  Wand2,
  CheckCircle,
  Circle,
  Lock
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ============================================
// TYPES
// ============================================

interface Scene {
  id: string;
  title: string;
  narration: string;
  imagePrompt: string;
  imageUrl: string | null;
  imageSource: 'generated' | 'uploaded' | null;
  imageSettled: boolean;  // User approved this image
  videoPrompt: string;
  videoUrl: string | null;
  duration: number;
}

interface StoryResearch {
  subject: string;
  dates: string;
  summary: string;
  context: string;
  sources: string[];
}

type Orchestrator = 'gemini' | 'codex' | 'claude';
type VideoRenderer = 'veo3' | 'remotion';
type AppStep = 'input' | 'generating' | 'scenes' | 'images' | 'videos';

// ============================================
// ORCHESTRATOR CONFIG
// ============================================

const ORCHESTRATORS = {
  gemini: {
    name: 'Gemini Agent',
    icon: Sparkles,
    color: 'from-blue-500 to-cyan-500',
    description: 'Fast visual descriptions, native image understanding',
    command: 'gemini-agent'
  },
  codex: {
    name: 'Codex Agent',
    icon: Terminal,
    color: 'from-green-500 to-emerald-500',
    description: 'Structured output, code-like precision',
    command: 'codex-agent'
  },
  claude: {
    name: 'Claude Code',
    icon: Bot,
    color: 'from-orange-500 to-amber-500',
    description: 'Best reasoning, iterative refinement',
    command: 'claude-code'
  }
};

// ============================================
// VIDEO RENDERER CONFIG
// ============================================

const VIDEO_RENDERERS = {
  remotion: {
    name: 'Remotion WebSlides',
    icon: Film,
    color: 'from-purple-500 to-pink-500',
    description: 'Free, local rendering with Ken Burns effect',
    cost: 'Free'
  },
  veo3: {
    name: 'Veo 3',
    icon: Sparkles,
    color: 'from-red-500 to-orange-500',
    description: 'AI-generated video from reference image',
    cost: '$0.50/clip'
  }
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function LifeStories() {
  // App state
  const [step, setStep] = useState<AppStep>('input');
  const [selectedOrchestrator, setSelectedOrchestrator] = useState<Orchestrator>('claude');
  const [selectedRenderer, setSelectedRenderer] = useState<VideoRenderer>('remotion');

  // Story input state
  const [storyInput, setStoryInput] = useState<StoryResearch>({
    subject: '',
    dates: '',
    summary: '',
    context: '',
    sources: []
  });
  const [sourceInput, setSourceInput] = useState('');

  // Scenes state
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [isGeneratingScenes, setIsGeneratingScenes] = useState(false);

  // Image state
  const [generatingImageFor, setGeneratingImageFor] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  // Video state
  const [generatingVideoFor, setGeneratingVideoFor] = useState<string | null>(null);

  // Save state
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('unsaved');

  // ============================================
  // SCENE GENERATION (CLI-based)
  // ============================================

  // Current project state
  const [projectId, setProjectId] = useState<string | null>(null);

  const generateScenes = async () => {
    if (!storyInput.subject || !storyInput.summary) {
      alert('Please enter at least a subject and summary');
      return;
    }

    setIsGeneratingScenes(true);
    setStep('generating');

    try {
      // Step 1: Create or update the project
      const projectName = storyInput.subject.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const projectResponse = await fetch(`${API_URL}/api/life-stories/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: projectId || projectName,
          name: storyInput.subject,
          subject: storyInput.subject,
          dates: storyInput.dates,
          summary: storyInput.summary,
          additionalContext: storyInput.context,
          sources: storyInput.sources.join('\n')
        })
      });

      const projectData = await projectResponse.json();
      if (!projectData.success) {
        throw new Error('Failed to create project');
      }

      const currentProjectId = projectData.project.id;
      setProjectId(currentProjectId);

      // Step 2: Queue scene generation with orchestrator
      const response = await fetch(`${API_URL}/api/life-stories/generate-scenes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: currentProjectId,
          orchestrator: selectedOrchestrator,
          storyInput: {
            subject: storyInput.subject,
            dates: storyInput.dates,
            summary: storyInput.summary,
            context: storyInput.context,
            sources: storyInput.sources
          }
        })
      });

      const data = await response.json();

      if (data.success && data.scenes) {
        setScenes(data.scenes);
        setStep('scenes');
      } else if (data.taskId) {
        // Task queued for CLI processing - poll for completion
        pollForScenes(data.taskId);
      } else {
        alert(data.error || 'Failed to generate scenes');
        setStep('input');
      }
    } catch (err) {
      console.error('Failed to generate scenes:', err);
      alert('Failed to connect to API');
      setStep('input');
    } finally {
      setIsGeneratingScenes(false);
    }
  };

  const pollForScenes = async (taskId: string) => {
    // Poll every 2 seconds for up to 5 minutes
    const maxAttempts = 150;
    let attempts = 0;

    const poll = async () => {
      attempts++;
      try {
        const res = await fetch(`${API_URL}/api/life-stories/task/${taskId}`);
        const data = await res.json();

        if (data.status === 'completed') {
          // Scenes are in data.output.scenes (set by the /complete endpoint)
          const generatedScenes = data.output?.scenes || [];
          if (generatedScenes.length > 0) {
            setScenes(generatedScenes);
            setStep('scenes');
            // Select first scene by default
            setSelectedScene(generatedScenes[0]);
          } else {
            alert('No scenes were generated');
            setStep('input');
          }
          setIsGeneratingScenes(false);
          return;
        }

        if (data.status === 'failed') {
          alert('Scene generation failed: ' + (data.error || 'Unknown error'));
          setStep('input');
          setIsGeneratingScenes(false);
          return;
        }

        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          alert('Generation timed out. Check if the CLI orchestrator is running.');
          setStep('input');
          setIsGeneratingScenes(false);
        }
      } catch {
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        }
      }
    };

    poll();
  };

  // ============================================
  // IMAGE GENERATION
  // ============================================

  const generateImage = async (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;

    setGeneratingImageFor(sceneId);

    try {
      const response = await fetch(`${API_URL}/api/images/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: scene.imagePrompt })
      });

      const data = await response.json();

      if (data.imageUrl || data.imageBase64) {
        const imageUrl = data.imageUrl || data.imageBase64;

        // Update local state
        setScenes(prev => prev.map(s =>
          s.id === sceneId
            ? { ...s, imageUrl, imageSource: 'generated', imageSettled: false }
            : s
        ));

        // Persist to backend if we have a project
        if (projectId && data.imageBase64) {
          try {
            await fetch(`${API_URL}/api/life-stories/projects/${projectId}/scenes/${sceneId}/image`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imageBase64: data.imageBase64, source: 'generated' })
            });
          } catch (err) {
            console.warn('Failed to persist image:', err);
          }
        }
      } else {
        alert('Failed to generate image: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Failed to generate image:', err);
      alert('Failed to connect to image API');
    } finally {
      setGeneratingImageFor(null);
    }
  };

  // ============================================
  // IMAGE UPLOAD
  // ============================================

  const handleImageUpload = (sceneId: string) => {
    setUploadingFor(sceneId);
    fileInputRef.current?.click();
  };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingFor) return;

    const sceneId = uploadingFor;

    // Convert to base64 for display
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;

      // Update local state
      setScenes(prev => prev.map(s =>
        s.id === sceneId
          ? { ...s, imageUrl: base64, imageSource: 'uploaded', imageSettled: false }
          : s
      ));
      setUploadingFor(null);

      // Persist to backend if we have a project
      if (projectId) {
        try {
          await fetch(`${API_URL}/api/life-stories/projects/${projectId}/scenes/${sceneId}/image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: base64, source: 'uploaded' })
          });
        } catch (err) {
          console.warn('Failed to persist uploaded image:', err);
        }
      }
    };
    reader.readAsDataURL(file);

    // Reset file input
    e.target.value = '';
  };

  // ============================================
  // SETTLE IMAGE (Approve for Veo 3)
  // ============================================

  const settleImage = async (sceneId: string) => {
    // Update local state immediately
    setScenes(prev => prev.map(s =>
      s.id === sceneId ? { ...s, imageSettled: true } : s
    ));

    // Persist to backend
    if (projectId) {
      try {
        await fetch(`${API_URL}/api/life-stories/projects/${projectId}/scenes/${sceneId}/settle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ settled: true })
        });
      } catch (err) {
        console.warn('Failed to persist settle state:', err);
      }
    }
  };

  const unsettleImage = async (sceneId: string) => {
    // Update local state immediately
    setScenes(prev => prev.map(s =>
      s.id === sceneId ? { ...s, imageSettled: false } : s
    ));

    // Persist to backend
    if (projectId) {
      try {
        await fetch(`${API_URL}/api/life-stories/projects/${projectId}/scenes/${sceneId}/settle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ settled: false })
        });
      } catch (err) {
        console.warn('Failed to persist unsettle state:', err);
      }
    }
  };

  // ============================================
  // VIDEO GENERATION (Veo 3 or Remotion WebSlides)
  // ============================================

  const generateVideo = async (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;

    if (!scene.imageSettled) {
      alert('Please settle on an image first before generating video');
      return;
    }

    setGeneratingVideoFor(sceneId);

    try {
      if (selectedRenderer === 'veo3') {
        // Veo 3: AI-generated video from reference image
        const endpoint = scene.imageUrl
          ? `${API_URL}/api/veo/generate-from-image`
          : `${API_URL}/api/veo/generate`;

        const body: Record<string, unknown> = {
          prompt: scene.videoPrompt,
          duration: 8,
          aspectRatio: '16:9'
        };

        if (scene.imageUrl) {
          body.imageBase64 = scene.imageUrl;
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        const data = await response.json();

        if (data.success && data.videoUrl) {
          setScenes(prev => prev.map(s =>
            s.id === sceneId ? { ...s, videoUrl: data.videoUrl } : s
          ));
        } else {
          alert('Failed to generate video: ' + (data.error || 'Unknown error'));
        }
      } else {
        // Remotion WebSlides: Compose video from images with Ken Burns effect
        const response = await fetch(`${API_URL}/api/video/render-scene`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sceneId: scene.id,
            title: scene.title,
            narration: scene.narration,
            imageUrl: scene.imageUrl,
            duration: scene.duration,
            effect: 'ken-burns' // Pan and zoom effect
          })
        });

        const data = await response.json();

        if (data.success && data.videoUrl) {
          setScenes(prev => prev.map(s =>
            s.id === sceneId ? { ...s, videoUrl: data.videoUrl } : s
          ));
        } else {
          alert('Failed to render video: ' + (data.error || 'Unknown error'));
        }
      }
    } catch (err) {
      console.error('Failed to generate video:', err);
      alert(`Failed to connect to ${selectedRenderer === 'veo3' ? 'Veo' : 'Remotion'} API`);
    } finally {
      setGeneratingVideoFor(null);
    }
  };

  const generateAllVideos = async () => {
    const settledScenes = scenes.filter(s => s.imageSettled && !s.videoUrl);

    if (settledScenes.length === 0) {
      alert('No scenes with settled images ready for video generation');
      return;
    }

    const isVeo = selectedRenderer === 'veo3';
    const cost = isVeo ? settledScenes.length * 0.5 : 0;
    const costText = isVeo ? `\nEstimated cost: $${cost.toFixed(2)}` : '\nCost: Free (local rendering)';

    if (!confirm(`Generate ${settledScenes.length} videos using ${VIDEO_RENDERERS[selectedRenderer].name}?${costText}`)) {
      return;
    }

    for (const scene of settledScenes) {
      await generateVideo(scene.id);
      await new Promise(r => setTimeout(r, 1000)); // Rate limiting
    }
  };

  // ============================================
  // HELPERS
  // ============================================

  const addSource = () => {
    if (sourceInput.trim()) {
      setStoryInput(prev => ({
        ...prev,
        sources: [...prev.sources, sourceInput.trim()]
      }));
      setSourceInput('');
    }
  };

  const removeSource = (index: number) => {
    setStoryInput(prev => ({
      ...prev,
      sources: prev.sources.filter((_, i) => i !== index)
    }));
  };

  const settledCount = scenes.filter(s => s.imageSettled).length;
  const videosCount = scenes.filter(s => s.videoUrl).length;

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileSelected}
      />

      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white">Life Stories</h1>
              <p className="text-xs text-zinc-500">Fact or Fiction</p>
            </div>
          </div>

          {step !== 'input' && step !== 'generating' && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-400">
                <CheckCircle className="w-3 h-3 inline mr-1 text-green-400" />
                {settledCount}/{scenes.length} settled
                <span className="mx-2">|</span>
                <Video className="w-3 h-3 inline mr-1 text-purple-400" />
                {videosCount}/{scenes.length} videos
              </span>

              {settledCount > 0 && (
                <button
                  onClick={generateAllVideos}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-sm font-medium transition-all"
                >
                  <Clapperboard className="w-4 h-4" />
                  Generate Videos (${(settledCount * 0.5).toFixed(2)})
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-white/10 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2">
            {(['input', 'scenes', 'images', 'videos'] as AppStep[]).map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  step === s ? 'bg-amber-500/20 text-amber-400' :
                  (s === 'generating' || (['scenes', 'images', 'videos'].includes(s) && step === 'input'))
                    ? 'text-zinc-600' : 'text-zinc-400'
                }`}>
                  {step === s ? <Circle className="w-3 h-3 fill-current" /> :
                   scenes.length > 0 && ['scenes', 'images', 'videos'].includes(s) ? <Check className="w-3 h-3" /> :
                   <Circle className="w-3 h-3" />}
                  {s === 'input' ? 'Story' : s.charAt(0).toUpperCase() + s.slice(1)}
                </div>
                {i < 3 && <ChevronRight className="w-4 h-4 text-zinc-700" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">

          {/* STEP 1: Story Input */}
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Story Details */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-400" />
                  Story Subject
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Subject Name *</label>
                    <input
                      type="text"
                      value={storyInput.subject}
                      onChange={(e) => setStoryInput(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="e.g., Edgar Tekere"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Dates</label>
                    <input
                      type="text"
                      value={storyInput.dates}
                      onChange={(e) => setStoryInput(prev => ({ ...prev, dates: e.target.value }))}
                      placeholder="e.g., 1937 - 2011"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm text-zinc-400 mb-2">Summary *</label>
                  <textarea
                    value={storyInput.summary}
                    onChange={(e) => setStoryInput(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Brief summary of who this person is and why their story matters..."
                    rows={3}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm text-zinc-400 mb-2">Additional Context</label>
                  <textarea
                    value={storyInput.context}
                    onChange={(e) => setStoryInput(prev => ({ ...prev, context: e.target.value }))}
                    placeholder="Key events, turning points, controversies, legacy..."
                    rows={4}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {/* Sources */}
                <div className="mt-6">
                  <label className="block text-sm text-zinc-400 mb-2">Sources (optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={sourceInput}
                      onChange={(e) => setSourceInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSource()}
                      placeholder="Add Wikipedia, news articles, etc."
                      className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={addSource}
                      className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {storyInput.sources.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {storyInput.sources.map((source, i) => (
                        <span key={i} className="flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-full text-sm">
                          {source}
                          <button onClick={() => removeSource(i)} className="ml-1 text-zinc-500 hover:text-red-400">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Orchestrator Selection */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-green-400" />
                  Scene Generator
                </h2>
                <p className="text-zinc-400 text-sm mb-4">
                  Choose which AI orchestrator generates your scene breakdown (all run via CLI):
                </p>

                <div className="grid grid-cols-3 gap-4">
                  {(Object.entries(ORCHESTRATORS) as [Orchestrator, typeof ORCHESTRATORS.gemini][]).map(([key, orch]) => {
                    const Icon = orch.icon;
                    const isSelected = selectedOrchestrator === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedOrchestrator(key)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${orch.color} flex items-center justify-center mb-3`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-semibold mb-1">{orch.name}</h3>
                        <p className="text-xs text-zinc-500">{orch.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Video Renderer Selection */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-400" />
                  Video Renderer
                </h2>
                <p className="text-zinc-400 text-sm mb-4">
                  Choose how to render the final video from your scenes:
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {(Object.entries(VIDEO_RENDERERS) as [VideoRenderer, typeof VIDEO_RENDERERS.remotion][]).map(([key, renderer]) => {
                    const Icon = renderer.icon;
                    const isSelected = selectedRenderer === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedRenderer(key)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${renderer.color} flex items-center justify-center mb-3`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            renderer.cost === 'Free'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {renderer.cost}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-1">{renderer.name}</h3>
                        <p className="text-xs text-zinc-500">{renderer.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateScenes}
                disabled={!storyInput.subject || !storyInput.summary}
                className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all"
              >
                <Wand2 className="w-5 h-5" />
                Generate Scenes with {ORCHESTRATORS[selectedOrchestrator].name}
              </button>
            </motion.div>
          )}

          {/* STEP 2: Generating (Loading State) */}
          {step === 'generating' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${ORCHESTRATORS[selectedOrchestrator].color} flex items-center justify-center mb-6 animate-pulse`}>
                {React.createElement(ORCHESTRATORS[selectedOrchestrator].icon, { className: 'w-10 h-10 text-white' })}
              </div>
              <h2 className="text-2xl font-bold mb-2">Generating Scenes</h2>
              <p className="text-zinc-400 mb-4">Using {ORCHESTRATORS[selectedOrchestrator].name}...</p>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                This may take a minute
              </div>
            </motion.div>
          )}

          {/* STEP 3: Scenes & Images */}
          {(step === 'scenes' || step === 'images' || step === 'videos') && (
            <motion.div
              key="scenes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-3 gap-6"
            >
              {/* Scene List */}
              <div className="col-span-1 space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Scenes ({scenes.length})</h3>
                  <button
                    onClick={() => setStep('input')}
                    className="text-xs text-zinc-500 hover:text-white flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    Edit Story
                  </button>
                </div>

                {scenes.map((scene, i) => (
                  <div
                    key={scene.id}
                    onClick={() => setSelectedScene(scene)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedScene?.id === scene.id
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                        scene.videoUrl ? 'bg-purple-500/20 text-purple-400' :
                        scene.imageSettled ? 'bg-green-500/20 text-green-400' :
                        scene.imageUrl ? 'bg-amber-500/20 text-amber-400' :
                        'bg-zinc-800 text-zinc-500'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{scene.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                          {scene.imageSettled && <CheckCircle className="w-3 h-3 text-green-400" />}
                          {scene.videoUrl && <Video className="w-3 h-3 text-purple-400" />}
                          <span>{scene.duration}s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scene Detail / Editor */}
              <div className="col-span-2">
                {selectedScene ? (
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedScene.title}</h2>
                      <p className="text-zinc-400 mt-2">{selectedScene.narration}</p>
                    </div>

                    {/* Image Section */}
                    <div className="border-t border-zinc-800 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-amber-400" />
                          Reference Image
                          {selectedScene.imageSettled && (
                            <span className="ml-2 px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Settled
                            </span>
                          )}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleImageUpload(selectedScene.id)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
                          >
                            <Upload className="w-4 h-4" />
                            Upload
                          </button>
                          <button
                            onClick={() => generateImage(selectedScene.id)}
                            disabled={generatingImageFor === selectedScene.id}
                            className="flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 rounded-lg text-sm transition-colors"
                          >
                            {generatingImageFor === selectedScene.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Wand2 className="w-4 h-4" />
                            )}
                            Generate
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-zinc-500 mb-3 font-mono bg-zinc-800/50 p-2 rounded">
                        {selectedScene.imagePrompt}
                      </div>

                      {selectedScene.imageUrl ? (
                        <div className="relative">
                          <img
                            src={selectedScene.imageUrl}
                            alt={selectedScene.title}
                            className="w-full rounded-lg border border-zinc-700"
                          />
                          <div className="absolute bottom-3 right-3 flex gap-2">
                            {!selectedScene.imageSettled ? (
                              <button
                                onClick={() => settleImage(selectedScene.id)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-sm transition-colors"
                              >
                                <Check className="w-4 h-4" />
                                Settle (Use for Video)
                              </button>
                            ) : (
                              <button
                                onClick={() => unsettleImage(selectedScene.id)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm transition-colors"
                              >
                                <RefreshCw className="w-4 h-4" />
                                Change Image
                              </button>
                            )}
                          </div>
                          <div className="absolute top-3 left-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              selectedScene.imageSource === 'uploaded'
                                ? 'bg-blue-500/80'
                                : 'bg-amber-500/80'
                            }`}>
                              {selectedScene.imageSource === 'uploaded' ? 'Uploaded' : 'Generated'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-video bg-zinc-800 rounded-lg flex items-center justify-center border border-dashed border-zinc-700">
                          <div className="text-center text-zinc-500">
                            <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Generate or upload an image</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Video Section */}
                    <div className="border-t border-zinc-800 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Video className="w-4 h-4 text-purple-400" />
                          Video (Veo 3)
                        </h3>
                        <button
                          onClick={() => generateVideo(selectedScene.id)}
                          disabled={!selectedScene.imageSettled || generatingVideoFor === selectedScene.id}
                          className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg text-sm transition-colors"
                        >
                          {generatingVideoFor === selectedScene.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Clapperboard className="w-4 h-4" />
                          )}
                          Generate ($0.50)
                        </button>
                      </div>

                      {!selectedScene.imageSettled && (
                        <p className="text-xs text-zinc-500 mb-3">
                          ⚠️ Settle on an image first to use it as reference for video generation
                        </p>
                      )}

                      <div className="text-xs text-zinc-500 mb-3 font-mono bg-zinc-800/50 p-2 rounded">
                        {selectedScene.videoPrompt}
                      </div>

                      {selectedScene.videoUrl ? (
                        <video
                          src={selectedScene.videoUrl}
                          controls
                          className="w-full rounded-lg border border-zinc-700"
                        />
                      ) : (
                        <div className="aspect-video bg-zinc-800 rounded-lg flex items-center justify-center border border-dashed border-zinc-700">
                          <div className="text-center text-zinc-500">
                            <Video className="w-10 h-10 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">
                              {selectedScene.imageSettled
                                ? 'Ready to generate video with settled image as reference'
                                : 'Settle on an image first'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 flex items-center justify-center">
                    <div className="text-center text-zinc-500">
                      <Film className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Select a scene to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
