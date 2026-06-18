/**
 * Life Stories Workspace - Documentary Scene Generator
 *
 * This workspace wraps Life Stories functionality within the Studio app,
 * sharing the Claude Code terminal for orchestration.
 *
 * Instead of direct API calls, context is pushed to Claude Code which
 * can invoke /gemini-agent or /codex-agent skills.
 */

import { useState, useRef, useEffect } from 'react';
import {
  Film,
  Image as ImageIcon,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Clock,
  User,
  Loader2,
  Check,
  Video,
  Clapperboard,
  Wand2,
  CheckCircle,
  Circle,
  Lock,
  Upload,
  RefreshCw,
  Sparkles,
  Terminal,
  Bot
} from 'lucide-react';

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
  imageSettled: boolean;
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

interface LifeStoriesWorkspaceProps {
  onContextUpdate?: (context: {
    workspace: 'life-stories';
    selection?: unknown;
    activeItem?: { id: string; name: string; type: string };
    metadata?: Record<string, unknown>;
  }) => void;
}

// ============================================
// ORCHESTRATOR CONFIG
// ============================================

const ORCHESTRATORS = {
  gemini: {
    name: 'Gemini Agent',
    icon: Sparkles,
    color: 'from-blue-500 to-cyan-500',
    description: 'Fast visual descriptions, native image understanding',
    command: '/gemini-agent'
  },
  codex: {
    name: 'Codex Agent',
    icon: Terminal,
    color: 'from-green-500 to-emerald-500',
    description: 'Structured output, code-like precision',
    command: '/codex-agent'
  },
  claude: {
    name: 'Claude Code',
    icon: Bot,
    color: 'from-orange-500 to-amber-500',
    description: 'Best reasoning, iterative refinement',
    command: 'direct'
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

export default function LifeStoriesWorkspace({ onContextUpdate }: LifeStoriesWorkspaceProps) {
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

  // Context update effect
  useEffect(() => {
    if (!onContextUpdate) return;

    onContextUpdate({
      workspace: 'life-stories',
      activeItem: selectedScene ? {
        id: selectedScene.id,
        name: selectedScene.title,
        type: 'scene'
      } : storyInput.subject ? {
        id: 'story',
        name: storyInput.subject,
        type: 'story-research'
      } : undefined,
      metadata: {
        step,
        orchestrator: selectedOrchestrator,
        renderer: selectedRenderer,
        sceneCount: scenes.length,
        settledCount: scenes.filter(s => s.imageSettled).length,
        videosCount: scenes.filter(s => s.videoUrl).length,
        storyInput: storyInput.subject ? {
          subject: storyInput.subject,
          dates: storyInput.dates,
          summary: storyInput.summary,
          context: storyInput.context,
          sources: storyInput.sources
        } : undefined
      }
    });
  }, [step, selectedOrchestrator, selectedRenderer, scenes, selectedScene, storyInput, onContextUpdate]);

  // ============================================
  // SCENE GENERATION (Context Push to Terminal)
  // ============================================

  const generateScenes = () => {
    if (!storyInput.subject || !storyInput.summary) {
      alert('Please enter at least a subject and summary');
      return;
    }

    setIsGeneratingScenes(true);
    setStep('generating');

    // Instead of API call, update context so Claude Code sees the request
    // The user will see context in the terminal panel and can trigger generation
    if (onContextUpdate) {
      onContextUpdate({
        workspace: 'life-stories',
        activeItem: {
          id: 'pending-generation',
          name: storyInput.subject,
          type: 'scene-generation-request'
        },
        metadata: {
          action: 'generate-scenes',
          orchestrator: selectedOrchestrator,
          orchestratorCommand: ORCHESTRATORS[selectedOrchestrator].command,
          storyInput: {
            subject: storyInput.subject,
            dates: storyInput.dates,
            summary: storyInput.summary,
            context: storyInput.context,
            sources: storyInput.sources
          }
        }
      });
    }

    // For now, show generating state briefly then prompt user to use terminal
    setTimeout(() => {
      setIsGeneratingScenes(false);
      setStep('input');
      // User should use terminal with context to generate scenes
    }, 2000);
  };

  // Load scenes from external source (exposed for Claude Code to call)
  // @ts-expect-error - Used externally by Claude Code terminal integration
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loadScenes = (generatedScenes: Scene[]) => {
    setScenes(generatedScenes);
    setStep('scenes');
    if (generatedScenes.length > 0) {
      setSelectedScene(generatedScenes[0]);
    }
  };

  // ============================================
  // IMAGE GENERATION
  // ============================================

  const generateImage = async (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;

    setGeneratingImageFor(sceneId);

    // Push context for image generation request
    if (onContextUpdate) {
      onContextUpdate({
        workspace: 'life-stories',
        activeItem: {
          id: sceneId,
          name: scene.title,
          type: 'image-generation-request'
        },
        metadata: {
          action: 'generate-image',
          sceneId,
          imagePrompt: scene.imagePrompt
        }
      });
    }

    // Simulate for now - in real use, Claude Code processes this
    setTimeout(() => setGeneratingImageFor(null), 1000);
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

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setScenes(prev => prev.map(s =>
        s.id === sceneId
          ? { ...s, imageUrl: base64, imageSource: 'uploaded', imageSettled: false }
          : s
      ));
      setUploadingFor(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ============================================
  // SETTLE IMAGE
  // ============================================

  const settleImage = (sceneId: string) => {
    setScenes(prev => prev.map(s =>
      s.id === sceneId ? { ...s, imageSettled: true } : s
    ));
  };

  const unsettleImage = (sceneId: string) => {
    setScenes(prev => prev.map(s =>
      s.id === sceneId ? { ...s, imageSettled: false } : s
    ));
  };

  // ============================================
  // VIDEO GENERATION
  // ============================================

  const generateVideo = async (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene || !scene.imageSettled) return;

    setGeneratingVideoFor(sceneId);

    // Push context for video generation request
    if (onContextUpdate) {
      onContextUpdate({
        workspace: 'life-stories',
        activeItem: {
          id: sceneId,
          name: scene.title,
          type: 'video-generation-request'
        },
        metadata: {
          action: 'generate-video',
          renderer: selectedRenderer,
          sceneId,
          videoPrompt: scene.videoPrompt,
          imageUrl: scene.imageUrl
        }
      });
    }

    setTimeout(() => setGeneratingVideoFor(null), 1000);
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
    <div className="h-full flex flex-col bg-gradient-to-br from-red-950/50 via-orange-950/30 to-amber-950/20 overflow-hidden">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileSelected}
      />

      {/* Workspace Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-white/10 flex items-center justify-between bg-black/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center">
            <Film className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-white text-sm">Life Stories</h2>
            <p className="text-xs text-zinc-500">Documentary Scene Generator</p>
          </div>
        </div>

        {scenes.length > 0 && (
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-400" />
              {settledCount}/{scenes.length}
            </span>
            <span className="flex items-center gap-1">
              <Video className="w-3 h-3 text-purple-400" />
              {videosCount}/{scenes.length}
            </span>
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="border-b border-white/5 bg-black/20 px-4 py-2">
        <div className="flex items-center gap-2 text-xs">
          {(['input', 'scenes', 'images', 'videos'] as const).map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${
                step === s ? 'bg-amber-500/20 text-amber-400' :
                scenes.length > 0 && ['scenes', 'images', 'videos'].includes(s)
                  ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                {step === s ? <Circle className="w-2 h-2 fill-current" /> :
                 scenes.length > 0 && ['scenes', 'images', 'videos'].includes(s) ? <Check className="w-2 h-2" /> :
                 <Circle className="w-2 h-2" />}
                {s === 'input' ? 'Story' : s.charAt(0).toUpperCase() + s.slice(1)}
              </div>
              {i < 3 && <ChevronRight className="w-3 h-3 text-zinc-700 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* STEP 1: Story Input */}
        {step === 'input' && (
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Story Details */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-zinc-300">
                <User className="w-4 h-4 text-amber-400" />
                Story Subject
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Subject Name *</label>
                  <input
                    type="text"
                    value={storyInput.subject}
                    onChange={(e) => setStoryInput(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="e.g., Alan Turing"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Dates</label>
                  <input
                    type="text"
                    value={storyInput.dates}
                    onChange={(e) => setStoryInput(prev => ({ ...prev, dates: e.target.value }))}
                    placeholder="e.g., 1912 - 1954"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-xs text-zinc-500 mb-1">Summary *</label>
                <textarea
                  value={storyInput.summary}
                  onChange={(e) => setStoryInput(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Brief summary of who this person is..."
                  rows={2}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="mt-3">
                <label className="block text-xs text-zinc-500 mb-1">Additional Context</label>
                <textarea
                  value={storyInput.context}
                  onChange={(e) => setStoryInput(prev => ({ ...prev, context: e.target.value }))}
                  placeholder="Key events, turning points, legacy..."
                  rows={3}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Sources */}
              <div className="mt-3">
                <label className="block text-xs text-zinc-500 mb-1">Sources</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sourceInput}
                    onChange={(e) => setSourceInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSource()}
                    placeholder="Add sources..."
                    className="flex-1 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={addSource}
                    className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {storyInput.sources.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {storyInput.sources.map((source, i) => (
                      <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-zinc-800 rounded text-xs">
                        {source.length > 30 ? source.slice(0, 30) + '...' : source}
                        <button onClick={() => removeSource(i)} className="text-zinc-500 hover:text-red-400">
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Orchestrator Selection */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-zinc-300">
                <Terminal className="w-4 h-4 text-green-400" />
                Scene Generator
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(ORCHESTRATORS) as [Orchestrator, typeof ORCHESTRATORS.gemini][]).map(([key, orch]) => {
                  const Icon = orch.icon;
                  const isSelected = selectedOrchestrator === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedOrchestrator(key)}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${orch.color} flex items-center justify-center mb-2`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-medium text-xs">{orch.name}</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{orch.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Video Renderer Selection */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-zinc-300">
                <Video className="w-4 h-4 text-purple-400" />
                Video Renderer
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(VIDEO_RENDERERS) as [VideoRenderer, typeof VIDEO_RENDERERS.remotion][]).map(([key, renderer]) => {
                  const Icon = renderer.icon;
                  const isSelected = selectedRenderer === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedRenderer(key)}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${renderer.color} flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          renderer.cost === 'Free'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {renderer.cost}
                        </span>
                      </div>
                      <h4 className="font-medium text-xs mt-2">{renderer.name}</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{renderer.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateScenes}
              disabled={!storyInput.subject || !storyInput.summary || isGeneratingScenes}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              {isGeneratingScenes ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Preparing Context...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Send to {ORCHESTRATORS[selectedOrchestrator].name}
                </>
              )}
            </button>

            <p className="text-xs text-zinc-500 text-center">
              Context will be sent to the Claude Code terminal for processing
            </p>
          </div>
        )}

        {/* STEP 2: Generating */}
        {step === 'generating' && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${ORCHESTRATORS[selectedOrchestrator].color} flex items-center justify-center mb-4 animate-pulse`}>
              {(() => { const Icon = ORCHESTRATORS[selectedOrchestrator].icon; return <Icon className="w-8 h-8 text-white" />; })()}
            </div>
            <h2 className="text-lg font-bold mb-1">Preparing Context</h2>
            <p className="text-zinc-400 text-sm mb-3">For {ORCHESTRATORS[selectedOrchestrator].name}</p>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Loader2 className="w-3 h-3 animate-spin" />
              Check terminal panel...
            </div>
          </div>
        )}

        {/* STEP 3+: Scene Editor */}
        {(step === 'scenes' || step === 'images' || step === 'videos') && (
          <div className="grid grid-cols-3 gap-4 h-full">
            {/* Scene List */}
            <div className="col-span-1 space-y-2 overflow-auto">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-zinc-400">Scenes ({scenes.length})</h3>
                <button
                  onClick={() => setStep('input')}
                  className="text-[10px] text-zinc-500 hover:text-white flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3" />
                  Edit
                </button>
              </div>

              {scenes.map((scene, i) => (
                <div
                  key={scene.id}
                  onClick={() => setSelectedScene(scene)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedScene?.id === scene.id
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
                      scene.videoUrl ? 'bg-purple-500/20 text-purple-400' :
                      scene.imageSettled ? 'bg-green-500/20 text-green-400' :
                      scene.imageUrl ? 'bg-amber-500/20 text-amber-400' :
                      'bg-zinc-800 text-zinc-500'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium truncate">{scene.title}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500 mt-0.5">
                        {scene.imageSettled && <CheckCircle className="w-2.5 h-2.5 text-green-400" />}
                        {scene.videoUrl && <Video className="w-2.5 h-2.5 text-purple-400" />}
                        <Clock className="w-2.5 h-2.5" />
                        <span>{scene.duration}s</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scene Detail */}
            <div className="col-span-2 overflow-auto">
              {selectedScene ? (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-4">
                  <div>
                    <h2 className="text-lg font-bold">{selectedScene.title}</h2>
                    <p className="text-xs text-zinc-400 mt-1">{selectedScene.narration}</p>
                  </div>

                  {/* Image Section */}
                  <div className="border-t border-zinc-800 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-semibold flex items-center gap-2">
                        <ImageIcon className="w-3 h-3 text-amber-400" />
                        Reference Image
                        {selectedScene.imageSettled && (
                          <span className="ml-1 px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded text-[10px] flex items-center gap-1">
                            <Lock className="w-2 h-2" /> Settled
                          </span>
                        )}
                      </h3>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleImageUpload(selectedScene.id)}
                          className="flex items-center gap-1 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-[10px] transition-colors"
                        >
                          <Upload className="w-3 h-3" />
                          Upload
                        </button>
                        <button
                          onClick={() => generateImage(selectedScene.id)}
                          disabled={generatingImageFor === selectedScene.id}
                          className="flex items-center gap-1 px-2 py-1 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 rounded text-[10px] transition-colors"
                        >
                          {generatingImageFor === selectedScene.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Wand2 className="w-3 h-3" />
                          )}
                          Generate
                        </button>
                      </div>
                    </div>

                    <div className="text-[10px] text-zinc-500 mb-2 font-mono bg-zinc-800/50 p-1.5 rounded">
                      {selectedScene.imagePrompt}
                    </div>

                    {selectedScene.imageUrl ? (
                      <div className="relative">
                        <img
                          src={selectedScene.imageUrl}
                          alt={selectedScene.title}
                          className="w-full rounded-lg border border-zinc-700"
                        />
                        <div className="absolute bottom-2 right-2 flex gap-1">
                          {!selectedScene.imageSettled ? (
                            <button
                              onClick={() => settleImage(selectedScene.id)}
                              className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-[10px] transition-colors"
                            >
                              <Check className="w-3 h-3" />
                              Settle
                            </button>
                          ) : (
                            <button
                              onClick={() => unsettleImage(selectedScene.id)}
                              className="flex items-center gap-1 px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-[10px] transition-colors"
                            >
                              <RefreshCw className="w-3 h-3" />
                              Change
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-zinc-800 rounded-lg flex items-center justify-center border border-dashed border-zinc-700">
                        <div className="text-center text-zinc-500">
                          <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                          <p className="text-xs">Generate or upload</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Video Section */}
                  <div className="border-t border-zinc-800 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-semibold flex items-center gap-2">
                        <Video className="w-3 h-3 text-purple-400" />
                        Video ({VIDEO_RENDERERS[selectedRenderer].name})
                      </h3>
                      <button
                        onClick={() => generateVideo(selectedScene.id)}
                        disabled={!selectedScene.imageSettled || generatingVideoFor === selectedScene.id}
                        className="flex items-center gap-1 px-2 py-1 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded text-[10px] transition-colors"
                      >
                        {generatingVideoFor === selectedScene.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Clapperboard className="w-3 h-3" />
                        )}
                        Generate
                      </button>
                    </div>

                    {!selectedScene.imageSettled && (
                      <p className="text-[10px] text-zinc-500 mb-2">
                        Settle on an image first to generate video
                      </p>
                    )}

                    <div className="text-[10px] text-zinc-500 mb-2 font-mono bg-zinc-800/50 p-1.5 rounded">
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
                          <Video className="w-8 h-8 mx-auto mb-1 opacity-50" />
                          <p className="text-xs">
                            {selectedScene.imageSettled ? 'Ready to generate' : 'Settle image first'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 flex items-center justify-center h-full">
                  <div className="text-center text-zinc-500">
                    <Film className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Select a scene</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
