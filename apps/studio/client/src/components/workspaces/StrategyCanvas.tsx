/**
 * Strategy Canvas - Business Deck & Proposal Creator
 *
 * Features:
 * - Company research and context gathering
 * - AI-powered deck/proposal generation
 * - Slide and content creation
 * - Business consulting workflows
 * - Export to presentation formats
 */

import { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Download,
  Sparkles,
  Building2,
  FileVideo,
  Image,
  Volume2,
  Loader2,
  ChevronRight,
  RefreshCw,
  CheckCircle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ============================================
// TYPES
// ============================================

interface Scene {
  id: number;
  title: string;
  narration: string;
  visualDescription: string;
  duration: number;
}

interface Storyboard {
  title: string;
  totalDuration: number;
  scenes: Scene[];
  presenterScript: string;
}

interface GenerationResults {
  successCount: number;
  totalScenes: number;
  failureCount: number;
}

interface VideoResults {
  message: string;
  video?: {
    filename: string;
    sizeMB: string;
    duration: number;
    scenes: number;
    downloadUrl: string;
  };
}

interface StrategyCanvasProps {
  onContextUpdate?: (context: {
    workspace: 'strategy-canvas';
    selection?: unknown;
    activeItem?: { id: string; name: string; type: string };
    metadata?: Record<string, unknown>;
  }) => void;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function StrategyCanvas({ onContextUpdate }: StrategyCanvasProps) {
  // Step state
  const [step, setStep] = useState<'input' | 'research' | 'interview' | 'generate'>('input');

  // Input state
  const [myCompany, setMyCompany] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [researchData, setResearchData] = useState<{ myCompanyContext: string; clientContext: string; message: string } | null>(null);

  // Interview state
  const [conversation, setConversation] = useState<Array<{ role: string; text: string }>>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [readyToGenerate, setReadyToGenerate] = useState(false);

  // Generation state
  const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [imageResults, setImageResults] = useState<GenerationResults | null>(null);
  const [isGeneratingNarration, setIsGeneratingNarration] = useState(false);
  const [narrationResults, setNarrationResults] = useState<GenerationResults | null>(null);
  const [isRenderingVideo, setIsRenderingVideo] = useState(false);
  const [videoResults, setVideoResults] = useState<VideoResults | null>(null);

  // Refs
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // Send context updates
  useEffect(() => {
    if (!onContextUpdate) return;

    onContextUpdate({
      workspace: 'strategy-canvas',
      activeItem: sessionId ? {
        id: sessionId,
        name: `${myCompany} → ${clientCompany}`,
        type: 'video-project'
      } : undefined,
      metadata: {
        step,
        hasStoryboard: !!storyboard,
        hasImages: !!imageResults,
        hasNarration: !!narrationResults,
        hasVideo: !!videoResults,
        conversationLength: conversation.length
      }
    });
  }, [step, sessionId, storyboard, imageResults, narrationResults, videoResults, conversation, onContextUpdate]);

  // Step 1: Research companies
  const handleResearch = async () => {
    if (!myCompany || !clientCompany) {
      alert('Please enter both company names');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`${API_URL}/api/video-director/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ myCompany, clientCompany })
      });

      const data = await response.json();
      setSessionId(data.sessionId);
      setResearchData(data);
      setConversation([{ role: 'assistant', text: data.message }]);
      setStep('interview');
    } catch (error) {
      console.error('Research failed:', error);
      alert('Research failed. Check console for details.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 2: Voice recording
  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorder.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);

        audioChunks.current = [];

        recorder.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          await handleAudioRecorded(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        };

        recorder.start();
        mediaRecorder.current = recorder;
        setIsRecording(true);
      } catch (error) {
        console.error('Microphone access denied:', error);
        alert('Please allow microphone access');
      }
    }
  };

  // Handle recorded audio
  const handleAudioRecorded = async (audioBlob: Blob) => {
    setIsProcessing(true);

    try {
      // Transcribe
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const transcribeResponse = await fetch(`${API_URL}/api/video-director/transcribe`, {
        method: 'POST',
        body: formData
      });

      const { text } = await transcribeResponse.json();
      setConversation(prev => [...prev, { role: 'user', text }]);

      // Interview
      const interviewResponse = await fetch(`${API_URL}/api/video-director/interview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, userMessage: text })
      });

      const interviewData = await interviewResponse.json();
      setConversation(prev => [...prev, { role: 'assistant', text: interviewData.agentMessage }]);
      setReadyToGenerate(interviewData.readyToGenerate);

      // TTS
      const ttsResponse = await fetch(`${API_URL}/api/video-director/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: interviewData.agentMessage, voice: 'alloy' })
      });

      const ttsBlob = await ttsResponse.blob();
      const audioUrl = URL.createObjectURL(ttsBlob);
      const audio = new Audio(audioUrl);
      audio.play();

    } catch (error) {
      console.error('Processing failed:', error);
      alert('Processing failed. Check console.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 3: Generate storyboard
  const handleGenerate = async () => {
    setIsProcessing(true);
    setStep('generate');

    try {
      const response = await fetch(`${API_URL}/api/video-director/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      const data = await response.json();
      setStoryboard(data.storyboard);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Generation failed. Check console.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 4: Generate Images
  const handleGenerateImages = async () => {
    setIsGeneratingImages(true);

    try {
      const response = await fetch(`${API_URL}/api/video-director/generate-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      const data = await response.json();
      setImageResults(data);
    } catch (error) {
      console.error('Image generation failed:', error);
      alert('Image generation failed.');
    } finally {
      setIsGeneratingImages(false);
    }
  };

  // Step 5: Generate Narration
  const handleGenerateNarration = async () => {
    setIsGeneratingNarration(true);

    try {
      const response = await fetch(`${API_URL}/api/video-director/generate-narration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      const data = await response.json();
      setNarrationResults(data);
    } catch (error) {
      console.error('Narration generation failed:', error);
      alert('Narration generation failed.');
    } finally {
      setIsGeneratingNarration(false);
    }
  };

  // Step 6: Render Video
  const handleRenderVideo = async () => {
    if (!confirm('Video rendering may take 20-40 minutes. Continue?')) return;

    setIsRenderingVideo(true);

    try {
      const response = await fetch(`${API_URL}/api/video-director/render-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error || 'Rendering failed');
      }

      const data = await response.json();
      setVideoResults(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Video rendering failed:', error);
      alert(`Video rendering failed: ${errorMessage}`);
    } finally {
      setIsRenderingVideo(false);
    }
  };

  // Download storyboard
  const handleDownloadStoryboard = () => {
    if (!storyboard) return;
    const data = JSON.stringify(storyboard, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `storyboard-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download video
  const handleDownloadVideo = () => {
    if (!videoResults?.video) return;
    window.open(`${API_URL}${videoResults.video.downloadUrl}`, '_blank');
  };

  // Reset project
  const handleReset = () => {
    if (!confirm('Start a new project? This will clear all current data.')) return;
    setStep('input');
    setMyCompany('');
    setClientCompany('');
    setSessionId('');
    setResearchData(null);
    setConversation([]);
    setReadyToGenerate(false);
    setStoryboard(null);
    setImageResults(null);
    setNarrationResults(null);
    setVideoResults(null);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-pink-950 via-purple-950 to-indigo-950 overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="text-pink-400" size={28} />
          <div>
            <h1 className="text-xl font-bold text-white">AI Video Director</h1>
            <p className="text-sm text-zinc-400">Tell me your story, I'll create the video</p>
          </div>
        </div>
        {step !== 'input' && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-zinc-300"
          >
            <RefreshCw size={14} />
            New Project
          </button>
        )}
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Input */}
          {step === 'input' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Your Company Name</label>
                  <div className="flex items-center gap-3">
                    <Building2 size={20} className="text-pink-400" />
                    <input
                      type="text"
                      value={myCompany}
                      onChange={(e) => setMyCompany(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-pink-500"
                      placeholder="e.g., iClean Services"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Client Company Name</label>
                  <div className="flex items-center gap-3">
                    <Building2 size={20} className="text-purple-400" />
                    <input
                      type="text"
                      value={clientCompany}
                      onChange={(e) => setClientCompany(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500"
                      placeholder="e.g., ABC Hospital"
                    />
                  </div>
                </div>

                <button
                  onClick={handleResearch}
                  disabled={isProcessing || !myCompany || !clientCompany}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 rounded-lg text-lg font-bold text-white flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Sparkles size={24} />
                      Start Interview
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Interview */}
          {step === 'interview' && (
            <div className="space-y-6">
              {/* Research Summary */}
              {researchData && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-sm text-zinc-300 mb-2">
                    <strong className="text-pink-400">{myCompany}:</strong> {researchData.myCompanyContext}
                  </p>
                  <p className="text-sm text-zinc-300">
                    <strong className="text-purple-400">{clientCompany}:</strong> {researchData.clientContext}
                  </p>
                </div>
              )}

              {/* Conversation */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-h-96 overflow-y-auto">
                {conversation.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg mb-3 ${
                      msg.role === 'user'
                        ? 'bg-blue-500/20 ml-8'
                        : 'bg-purple-500/20 mr-8'
                    }`}
                  >
                    <div className="text-xs text-zinc-400 mb-1">
                      {msg.role === 'user' ? 'You' : 'AI Director'}
                    </div>
                    <div className="text-white">{msg.text}</div>
                  </div>
                ))}
              </div>

              {/* Recording Controls */}
              <div className="flex gap-4">
                <button
                  onClick={toggleRecording}
                  disabled={isProcessing}
                  className={`flex-1 py-4 rounded-lg font-bold flex items-center justify-center gap-3 transition-all ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                      : 'bg-white/10 hover:bg-white/20'
                  } text-white disabled:opacity-50`}
                >
                  {isRecording ? (
                    <>
                      <Square size={24} />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic size={24} />
                      Start Recording
                    </>
                  )}
                </button>

                {readyToGenerate && (
                  <button
                    onClick={handleGenerate}
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 rounded-lg font-bold text-white flex items-center justify-center gap-3"
                  >
                    <FileVideo size={24} />
                    Generate Video
                  </button>
                )}
              </div>

              {isProcessing && (
                <div className="text-center text-white flex items-center justify-center gap-3">
                  <Loader2 className="animate-spin" size={24} />
                  Processing...
                </div>
              )}
            </div>
          )}

          {/* Step 3: Generation */}
          {step === 'generate' && storyboard && (
            <div className="space-y-6">
              {/* Storyboard Header */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h2 className="text-xl font-bold text-white mb-2">{storyboard.title}</h2>
                <p className="text-zinc-400">Duration: {storyboard.totalDuration}s • {storyboard.scenes.length} scenes</p>
              </div>

              {/* Scenes */}
              <div className="space-y-3">
                {storyboard.scenes.map((scene) => (
                  <div key={scene.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white">Scene {scene.id}: {scene.title}</h4>
                      <span className="text-xs text-zinc-400">{scene.duration}s</span>
                    </div>
                    <p className="text-sm text-zinc-300 mb-2">{scene.narration}</p>
                    <p className="text-xs text-zinc-500">Visual: {scene.visualDescription}</p>
                  </div>
                ))}
              </div>

              {/* Presenter Script */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                <h4 className="font-semibold text-purple-300 mb-2">Your Presenter Script</h4>
                <p className="text-sm text-white whitespace-pre-line">{storyboard.presenterScript}</p>
              </div>

              {/* Pipeline Progress */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h4 className="font-semibold text-white mb-4">Pipeline Progress</h4>
                <div className="space-y-3">
                  {/* Step: Download Storyboard */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Storyboard</span>
                    <button
                      onClick={handleDownloadStoryboard}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm"
                    >
                      <Download size={14} />
                      Download
                    </button>
                  </div>

                  {/* Step: Generate Images */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image size={16} className="text-green-400" />
                      <span className="text-zinc-300">Generate Images</span>
                    </div>
                    {imageResults ? (
                      <span className="flex items-center gap-2 text-sm text-green-400">
                        <CheckCircle size={14} />
                        {imageResults.successCount}/{imageResults.totalScenes}
                      </span>
                    ) : (
                      <button
                        onClick={handleGenerateImages}
                        disabled={isGeneratingImages}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 disabled:opacity-50 text-green-400 rounded-lg text-sm"
                      >
                        {isGeneratingImages ? <Loader2 className="animate-spin" size={14} /> : <ChevronRight size={14} />}
                        {isGeneratingImages ? 'Generating...' : 'Generate'}
                      </button>
                    )}
                  </div>

                  {/* Step: Generate Narration */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 size={16} className="text-purple-400" />
                      <span className="text-zinc-300">Generate Narration</span>
                    </div>
                    {narrationResults ? (
                      <span className="flex items-center gap-2 text-sm text-purple-400">
                        <CheckCircle size={14} />
                        {narrationResults.successCount}/{narrationResults.totalScenes}
                      </span>
                    ) : (
                      <button
                        onClick={handleGenerateNarration}
                        disabled={isGeneratingNarration || !imageResults}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 text-purple-400 rounded-lg text-sm"
                      >
                        {isGeneratingNarration ? <Loader2 className="animate-spin" size={14} /> : <ChevronRight size={14} />}
                        {isGeneratingNarration ? 'Generating...' : 'Generate'}
                      </button>
                    )}
                  </div>

                  {/* Step: Render Video */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileVideo size={16} className="text-pink-400" />
                      <span className="text-zinc-300">Render Video</span>
                    </div>
                    {videoResults?.video ? (
                      <button
                        onClick={handleDownloadVideo}
                        className="flex items-center gap-2 px-3 py-1.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 rounded-lg text-sm"
                      >
                        <Download size={14} />
                        {videoResults.video.sizeMB} MB
                      </button>
                    ) : (
                      <button
                        onClick={handleRenderVideo}
                        disabled={isRenderingVideo || !narrationResults}
                        className="flex items-center gap-2 px-3 py-1.5 bg-pink-500/20 hover:bg-pink-500/30 disabled:opacity-50 text-pink-400 rounded-lg text-sm"
                      >
                        {isRenderingVideo ? <Loader2 className="animate-spin" size={14} /> : <ChevronRight size={14} />}
                        {isRenderingVideo ? 'Rendering...' : 'Render'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Video Result */}
              {videoResults?.video && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
                  <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
                  <h3 className="text-xl font-bold text-white mb-2">Video Ready!</h3>
                  <p className="text-zinc-400 mb-4">
                    {videoResults.video.filename} • {videoResults.video.sizeMB} MB • {videoResults.video.duration}s
                  </p>
                  <button
                    onClick={handleDownloadVideo}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg font-bold text-white flex items-center gap-3 mx-auto"
                  >
                    <Download size={20} />
                    Download Video
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Loading state for generation */}
          {step === 'generate' && !storyboard && isProcessing && (
            <div className="text-center py-12">
              <Loader2 size={48} className="animate-spin mx-auto mb-4 text-purple-400" />
              <p className="text-white text-lg">Generating your video storyboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
