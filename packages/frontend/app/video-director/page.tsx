'use client';

import { useState, useRef } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function VideoDirectorPage() {
  const [step, setStep] = useState<'input' | 'research' | 'interview' | 'generate'>('input');
  const [myCompany, setMyCompany] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [researchData, setResearchData] = useState<any>(null);
  const [conversation, setConversation] = useState<Array<{ role: string, text: string }>>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [readyToGenerate, setReadyToGenerate] = useState(false);
  const [storyboard, setStoryboard] = useState<any>(null);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [imageResults, setImageResults] = useState<any>(null);
  const [isGeneratingNarration, setIsGeneratingNarration] = useState(false);
  const [narrationResults, setNarrationResults] = useState<any>(null);
  const [isRenderingVideo, setIsRenderingVideo] = useState(false);
  const [videoResults, setVideoResults] = useState<any>(null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

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

  // Step 2: Start/Stop recording
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorder.current?.stop();
      setIsRecording(false);
    } else {
      // Start recording
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
      // Step 1: Transcribe
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const transcribeResponse = await fetch(`${API_URL}/api/video-director/transcribe`, {
        method: 'POST',
        body: formData
      });

      const { text } = await transcribeResponse.json();

      // Add user message to conversation
      setConversation(prev => [...prev, { role: 'user', text }]);

      // Step 2: Send to interview agent
      const interviewResponse = await fetch(`${API_URL}/api/video-director/interview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, userMessage: text })
      });

      const interviewData = await interviewResponse.json();

      // Add agent response to conversation
      setConversation(prev => [...prev, { role: 'assistant', text: interviewData.agentMessage }]);
      setReadyToGenerate(interviewData.readyToGenerate);

      // Step 3: Play agent response
      const ttsResponse = await fetch(`${API_URL}/api/video-director/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: interviewData.agentMessage, voice: 'alloy' })
      });

      const audioBlob2 = await ttsResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob2);
      const audio = new Audio(audioUrl);
      audio.play();

    } catch (error) {
      console.error('Processing failed:', error);
      alert('Processing failed. Check console.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 3: Generate video
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
      alert(`Images generated! ${data.successCount}/${data.totalScenes} successful`);
    } catch (error) {
      console.error('Image generation failed:', error);
      alert('Image generation failed. Check console.');
    } finally {
      setIsGeneratingImages(false);
    }
  };

  // Step 5: Generate Narration Audio
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
      alert(`Narration generated! ${data.successCount}/${data.totalScenes} audio files created`);
    } catch (error) {
      console.error('Narration generation failed:', error);
      alert('Narration generation failed. Check console.');
    } finally {
      setIsGeneratingNarration(false);
    }
  };

  // Step 6: Render Video
  const handleRenderVideo = async () => {
    setIsRenderingVideo(true);

    try {
      // Show warning about render time
      const confirmed = confirm(
        'Video rendering may take 20-40 minutes for a 10-minute video. ' +
        'The page will wait for completion. Do you want to proceed?'
      );

      if (!confirmed) {
        setIsRenderingVideo(false);
        return;
      }

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
      alert(`Video rendered successfully! File size: ${data.video.sizeMB} MB`);
    } catch (error: any) {
      console.error('Video rendering failed:', error);
      alert(`Video rendering failed: ${error.message}`);
    } finally {
      setIsRenderingVideo(false);
    }
  };

  // Download video
  const handleDownloadVideo = () => {
    if (!videoResults || !videoResults.video) return;

    const downloadUrl = `${API_URL}${videoResults.video.downloadUrl}`;
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎬 AI Video Director
          </h1>
          <p className="text-xl text-purple-200">
            Tell me your story, I'll create the video
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">

          {/* Step 1: Input */}
          {step === 'input' && (
            <div className="space-y-6">
              <div>
                <label className="block text-white text-lg mb-2">Your Company Name</label>
                <input
                  type="text"
                  value={myCompany}
                  onChange={(e) => setMyCompany(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:border-white/60"
                  placeholder="e.g., iClean Services"
                />
              </div>

              <div>
                <label className="block text-white text-lg mb-2">Client Company Name</label>
                <input
                  type="text"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:border-white/60"
                  placeholder="e.g., ABC Hospital"
                />
              </div>

              <button
                onClick={handleResearch}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 transition-all"
              >
                {isProcessing ? 'Researching...' : 'Start Interview 🚀'}
              </button>
            </div>
          )}

          {/* Step 2: Interview */}
          {step === 'interview' && (
            <div className="space-y-6">
              {/* Research Summary */}
              {researchData && (
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <p className="text-white/80 text-sm mb-2">
                    <strong>{myCompany}:</strong> {researchData.myCompanyContext}
                  </p>
                  <p className="text-white/80 text-sm">
                    <strong>{clientCompany}:</strong> {researchData.clientContext}
                  </p>
                </div>
              )}

              {/* Conversation History */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {conversation.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-500/20 ml-8'
                        : 'bg-purple-500/20 mr-8'
                    }`}
                  >
                    <div className="text-xs text-white/60 mb-1">
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
                  className={`flex-1 py-4 rounded-lg font-bold transition-all ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  } disabled:opacity-50`}
                >
                  {isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
                </button>

                {readyToGenerate && (
                  <button
                    onClick={handleGenerate}
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50"
                  >
                    Generate Video 🎬
                  </button>
                )}
              </div>

              {isProcessing && (
                <div className="text-center text-white">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full mb-2"></div>
                  <p>Processing...</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Generated Output */}
          {step === 'generate' && storyboard && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                ✨ Video Storyboard Generated!
              </h2>

              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-xl text-white mb-2">{storyboard.title}</h3>
                <p className="text-white/80">Duration: {storyboard.totalDuration}s</p>
              </div>

              {/* Scenes */}
              <div className="space-y-4">
                {storyboard.scenes.map((scene: any) => (
                  <div key={scene.id} className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-lg text-white font-bold mb-2">
                      Scene {scene.id}: {scene.title}
                    </h4>
                    <p className="text-white/80 mb-2">{scene.narration}</p>
                    <p className="text-sm text-white/60">
                      Visual: {scene.visualDescription} ({scene.duration}s)
                    </p>
                  </div>
                ))}
              </div>

              {/* Presenter Script */}
              <div className="bg-purple-500/20 rounded-lg p-4">
                <h4 className="text-lg text-white font-bold mb-2">📝 Your Presenter Script</h4>
                <p className="text-white whitespace-pre-line">{storyboard.presenterScript}</p>
              </div>

              {/* Action Buttons - Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
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
                  }}
                  className="py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg hover:from-blue-600 hover:to-cyan-600"
                >
                  💾 Download Storyboard
                </button>

                <button
                  onClick={handleGenerateImages}
                  disabled={isGeneratingImages || !storyboard}
                  className="py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50"
                >
                  {isGeneratingImages ? '🎨 Generating...' : '🎨 Generate Images'}
                </button>
              </div>

              {/* Action Buttons - Row 2 */}
              {imageResults && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleGenerateNarration}
                    disabled={isGeneratingNarration}
                    className="py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50"
                  >
                    {isGeneratingNarration ? '🎙️  Generating...' : '🎙️  Generate Narration'}
                  </button>

                  <button
                    onClick={handleRenderVideo}
                    disabled={isRenderingVideo || !narrationResults}
                    className="py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-red-600 disabled:opacity-50"
                  >
                    {isRenderingVideo ? '🎬 Preparing...' : '🎬 Prepare Video'}
                  </button>
                </div>
              )}

              {/* Image Generation Results */}
              {imageResults && (
                <div className="bg-green-500/20 rounded-lg p-4">
                  <h4 className="text-lg text-white font-bold mb-2">✨ Images Generated!</h4>
                  <p className="text-white">
                    Successfully generated {imageResults.successCount} out of {imageResults.totalScenes} images
                  </p>
                  {imageResults.failureCount > 0 && (
                    <p className="text-red-300 text-sm mt-1">
                      {imageResults.failureCount} images failed to generate
                    </p>
                  )}
                </div>
              )}

              {/* Narration Generation Results */}
              {narrationResults && (
                <div className="bg-purple-500/20 rounded-lg p-4">
                  <h4 className="text-lg text-white font-bold mb-2">🎙️  Narration Generated!</h4>
                  <p className="text-white">
                    Successfully generated {narrationResults.successCount} out of {narrationResults.totalScenes} audio files
                  </p>
                  {narrationResults.failureCount > 0 && (
                    <p className="text-red-300 text-sm mt-1">
                      {narrationResults.failureCount} audio files failed to generate
                    </p>
                  )}
                </div>
              )}

              {/* Video Composition Results */}
              {videoResults && (
                <div className="bg-pink-500/20 rounded-lg p-4">
                  <h4 className="text-lg text-white font-bold mb-3">🎬 Video Ready!</h4>

                  {videoResults.video ? (
                    <>
                      {/* Video successfully rendered */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">File:</span>
                          <span className="text-white font-mono text-sm">{videoResults.video.filename}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">Size:</span>
                          <span className="text-white">{videoResults.video.sizeMB} MB</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">Duration:</span>
                          <span className="text-white">{videoResults.video.duration} seconds</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">Scenes:</span>
                          <span className="text-white">{videoResults.video.scenes}</span>
                        </div>

                        {/* Download Button */}
                        <button
                          onClick={handleDownloadVideo}
                          className="w-full mt-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-600 flex items-center justify-center gap-2"
                        >
                          <span>📥</span>
                          <span>Download Video ({videoResults.video.sizeMB} MB)</span>
                        </button>

                        <p className="text-white/60 text-xs text-center mt-2">
                          ✅ {videoResults.message}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Video composition prepared (old format) */}
                      <p className="text-white mb-2">
                        Video composition prepared with {videoResults.videoData?.scenes?.length || 0} scenes
                      </p>
                      <p className="text-white/80 text-sm mb-3">
                        Total duration: {videoResults.videoData?.totalDuration || 0} seconds
                      </p>
                      <p className="text-white/70 text-xs">
                        {videoResults.message}
                      </p>
                    </>
                  )}
                </div>
              )}

              <div className="text-center text-white/80">
                <p>🎉 Pipeline Progress:</p>
                <p className="text-sm mt-2">
                  {!imageResults && '✨ Step 1: Generate Images'}
                  {imageResults && !narrationResults && '🎙️  Step 2: Generate Narration'}
                  {narrationResults && !videoResults && '🎬 Step 3: Prepare Video'}
                  {videoResults && '✅ All steps complete!'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
